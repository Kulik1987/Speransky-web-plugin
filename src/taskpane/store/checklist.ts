import { makeAutoObservable, runInAction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import {
  ChecklistShortInfo,
  ResponseChecklistDto,
  PayloadChecklistAddRuleDto,
  PayloadChecklistUpdateDto,
} from "../api/types";
import { getApiErrorDetail, getCopyName } from "../helpers";
import { ChecklistErrorCodeEnum } from "../enums";

export type DraftRule = PayloadChecklistAddRuleDto & { id?: string };

export type DeleteChecklistResult = "success" | "in_use" | "error";

interface OriginalDraft {
  checklistName: string;
  checklistDescription: string;
  checklistDocType: string;
  checklistParty: string;
  checklistRules: DraftRule[];
}

const initialDraft = {
  editingChecklistId: null as string | null,
  checklistName: "",
  checklistDescription: "",
  checklistDocType: "",
  checklistParty: "",
  checklistRules: [] as DraftRule[],
  ruleType: "simple" as "simple" | "advanced",
};

class CheckList {
  rootStore: RootStore;

  private checklistApi = api.checklist;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // Список всех чек-листов
  checklists: ChecklistShortInfo[] | null = null;
  checklistsError: string | null = null;
  isChecklistsLoading: boolean = false;

  // Состояние операций записи
  isSaving: boolean = false;
  isDraftLoading: boolean = false;
  isFormOpen: boolean = false;

  // Черновик: поля формы создания/редактирования чек-листа
  editingChecklistId: string | null = initialDraft.editingChecklistId;
  checklistName: string = initialDraft.checklistName;
  checklistDescription: string = initialDraft.checklistDescription;
  checklistDocType: string = initialDraft.checklistDocType;
  checklistParty: string = initialDraft.checklistParty;
  checklistRules: DraftRule[] = initialDraft.checklistRules;
  ruleType: "simple" | "advanced" = initialDraft.ruleType;

  // Состояние чек-листа на момент загрузки с сервера
  private originalDraft: OriginalDraft | null = null;

  setIsFormOpen = (value: boolean) => {
    this.isFormOpen = value;
  };

  setEditingChecklistId = (id: string | null) => {
    this.editingChecklistId = id;
  };
  setChecklistName = (value: string) => {
    this.checklistName = value;
  };
  setChecklistDocType = (value: string) => {
    this.checklistDocType = value;
  };
  setChecklistParty = (value: string) => {
    this.checklistParty = value;
  };

  /**
   * @description Инициализирует черновик.
   * Без аргументов: сбрасывает в начальное состояние (режим создания).
   * С аргументом: заполняет данными существующего чек-листа (режим редактирования).
   */
  initDraft = (checklist?: ResponseChecklistDto) => {
    if (checklist) {
      this.editingChecklistId = checklist.id;
      this.checklistName = checklist.name;
      this.checklistDescription = checklist.description ?? "";
      this.checklistDocType = checklist.doc_type ?? "";
      this.checklistParty = checklist.party ?? "";
      this.checklistRules = [...checklist.rules]
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((rule): DraftRule => {
          const { risk_triggers, ...rest } = rule;
          const cleanedRule = Object.fromEntries(
            Object.entries(rest).filter(([key, value]) => key !== "created_at" && value !== null)
          );
          return {
            ...cleanedRule,
            risk_triggers: risk_triggers
              ? risk_triggers.map(({ risk_level, risk_trigger }) => ({ risk_level, risk_trigger }))
              : null,
          } as DraftRule;
        });
      this.originalDraft = {
        checklistName: this.checklistName,
        checklistDescription: this.checklistDescription,
        checklistDocType: this.checklistDocType,
        checklistParty: this.checklistParty,
        checklistRules: this.checklistRules.map((rule) => ({ ...rule })),
      };
    } else {
      this.originalDraft = null;
      this.editingChecklistId = initialDraft.editingChecklistId;
      this.checklistName = initialDraft.checklistName;
      this.checklistDescription = initialDraft.checklistDescription;
      this.checklistDocType = initialDraft.checklistDocType;
      this.checklistParty = initialDraft.checklistParty;
      this.checklistRules = [];
      this.ruleType = initialDraft.ruleType;
    }
  };

  /** @description Сбрасывает состояние черновика */
  clearDraft = () => this.initDraft();

  /**
   * @description Обновляет поля черновика и сохраняет чек-лист на сервере.
   * Параметры, не переданные явно, остаются без изменений.
   */
  submitDraft = async (
    name?: string,
    docType?: string,
    party?: string,
    rules?: DraftRule[],
    deletedRuleIds?: string[]
  ): Promise<boolean> => {
    this.checklistName = name ?? this.checklistName;
    this.checklistDocType = docType ?? this.checklistDocType;
    this.checklistParty = party ?? this.checklistParty;
    this.checklistRules = rules ?? this.checklistRules;
    return this.saveChecklist(deletedRuleIds);
  };

  /**
   * @description Сохраняет чек-лист.
   * Создание: создает чек-лист с правилами.
   * Редактирование: обновляет метаданные + параллельно обновляет/добавляет/удаляет правила по id.
   */
  saveChecklist = async (deletedRuleIds?: string[]): Promise<boolean> => {
    runInAction(() => {
      this.isSaving = true;
    });

    try {
      if (this.editingChecklistId) {
        const checklistId = this.editingChecklistId;
        const original = this.originalDraft;
        const metadataPatch: PayloadChecklistUpdateDto = {};

        if (!original || this.checklistName !== original.checklistName) metadataPatch.name = this.checklistName;
        if (!original || this.checklistDescription !== original.checklistDescription)
          metadataPatch.description = this.checklistDescription || undefined;
        if (!original || this.checklistDocType !== original.checklistDocType)
          metadataPatch.doc_type = this.checklistDocType || undefined;
        if (!original || this.checklistParty !== original.checklistParty)
          metadataPatch.party = this.checklistParty || undefined;

        if (Object.keys(metadataPatch).length > 0) {
          await this.checklistApi.update(checklistId, metadataPatch);
        }

        const originalRuleById = new Map<string, DraftRule>();
        if (original) {
          for (const rule of original.checklistRules) {
            if (rule.id) originalRuleById.set(rule.id, rule);
          }
        }

        await Promise.all([
          ...this.checklistRules.map(({ id, ...ruleContent }) => {
            if (!id || id.startsWith("_local_"))
              return this.checklistApi.addRule(checklistId, ruleContent as PayloadChecklistAddRuleDto);

            const orig = originalRuleById.get(id);
            if (orig) {
              const origWithoutId = JSON.stringify(orig, (k, v) => (k === "id" ? undefined : v));
              if (JSON.stringify(ruleContent) === origWithoutId) return Promise.resolve();
            }
            return this.checklistApi.updateRule(id, ruleContent as PayloadChecklistAddRuleDto);
          }),
          ...(deletedRuleIds ?? []).map((id) => this.checklistApi.deleteRule(id)),
        ]);
      } else {
        await this.checklistApi.create({
          name: this.checklistName,
          description: this.checklistDescription || undefined,
          doc_type: this.checklistDocType || undefined,
          party: this.checklistParty || undefined,
          rules: this.checklistRules.map(
            (rule): PayloadChecklistAddRuleDto =>
              Object.fromEntries(Object.entries(rule).filter(([key]) => key !== "id")) as PayloadChecklistAddRuleDto
          ),
        });
      }

      await this.getChecklists();
      this.clearDraft();

      console.log("saveChecklist [success]");
      return true;
    } catch (error) {
      console.error("saveChecklist [error]", error);
      return false;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  };

  /**
   * @description Создаёт копию чек-листа с префиксом "Копия - " в названии
   */
  duplicateChecklist = async (checklistId: string): Promise<boolean> => {
    runInAction(() => {
      this.isSaving = true;
    });

    try {
      const { data } = await this.checklistApi.get(checklistId);
      const existingNames = this.checklists?.map((c) => c.name) ?? [];

      await this.checklistApi.create({
        name: getCopyName(data.name, existingNames),
        description: data.description,
        doc_type: data.doc_type,
        party: data.party,
        rules: data.rules.map((rule): PayloadChecklistAddRuleDto => {
          const { risk_triggers, ...rest } = rule;
          return {
            ...Object.fromEntries(
              Object.entries(rest).filter(([key, value]) => !["id", "created_at"].includes(key) && value !== null)
            ),
            risk_triggers: risk_triggers
              ? risk_triggers.map(({ risk_level, risk_trigger }) => ({ risk_level, risk_trigger }))
              : null,
          } as PayloadChecklistAddRuleDto;
        }),
      });

      await this.getChecklists();

      console.log("duplicateChecklist [success]");
      return true;
    } catch (error) {
      console.error("duplicateChecklist [error]", error);
      return false;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  };

  /** @description Загружает список всех чек-листов */
  getChecklists = async () => {
    runInAction(() => {
      this.isChecklistsLoading = true;
      this.checklistsError = null;
    });

    try {
      const response = await this.checklistApi.list();

      runInAction(() => {
        this.checklists = response.data;
        this.isChecklistsLoading = false;
      });

      console.log("getChecklists [success]", response.data);
    } catch (error) {
      console.error("getChecklists [error]", error);

      runInAction(() => {
        this.checklists = null;
        this.checklistsError = "failed-to-load";
        this.isChecklistsLoading = false;
      });
    }
  };

  /** @description Загружает чек-лист по ID и инициализирует черновик для редактирования */
  getChecklistById = async (checklistId: string) => {
    runInAction(() => {
      this.isDraftLoading = true;
    });

    try {
      const response = await this.checklistApi.get(checklistId);

      runInAction(() => {
        this.isDraftLoading = false;
      });
      this.initDraft(response.data);

      console.log("getChecklistById [success]", response.data);
      return response.data;
    } catch (error) {
      console.error("getChecklistById [error]", error);

      runInAction(() => {
        this.isDraftLoading = false;
      });
      return null;
    }
  };

  /** @description Удаляет чек-лист */
  deleteChecklist = async (checklistId: string): Promise<DeleteChecklistResult> => {
    try {
      await this.checklistApi.delete(checklistId);

      if (this.editingChecklistId === checklistId) {
        this.clearDraft();
      }

      await this.getChecklists();

      console.log("deleteChecklist [success]");
      return "success";
    } catch (error) {
      console.error("deleteChecklist [error]", error);

      const errorCode = getApiErrorDetail(error)?.code;
      return errorCode === ChecklistErrorCodeEnum.IN_USE_BY_RUNNING_ANALYSIS ? "in_use" : "error";
    }
  };

  /** @description Состояние наличия сохранённых чек-листов */
  get hasChecklists(): boolean {
    return Array.isArray(this.checklists) && this.checklists.length > 0;
  }

  reset = () => {
    runInAction(() => {
      this.checklists = null;
      this.checklistsError = null;
      this.isChecklistsLoading = false;
      this.isDraftLoading = false;
      this.isSaving = false;
      this.isFormOpen = false;
      this.clearDraft();
    });
  };
}

export default CheckList;
