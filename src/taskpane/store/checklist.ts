import { makeAutoObservable, runInAction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import { ChecklistShortInfo, ResponseChecklistDto, PayloadChecklistAddRuleDto } from "../api/types";

export type DraftRule = PayloadChecklistAddRuleDto & { id?: string };

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

  // Черновик: поля формы создания/редактирования чек-листа
  editingChecklistId: string | null = initialDraft.editingChecklistId;
  checklistName: string = initialDraft.checklistName;
  checklistDescription: string = initialDraft.checklistDescription;
  checklistDocType: string = initialDraft.checklistDocType;
  checklistParty: string = initialDraft.checklistParty;
  checklistRules: DraftRule[] = initialDraft.checklistRules;
  ruleType: "simple" | "advanced" = initialDraft.ruleType;

  setEditingChecklistId = (id: string | null) => {
    this.editingChecklistId = id;
  };
  setChecklistName = (value: string) => {
    this.checklistName = value;
  };
  setChecklistDocType = (value: string) => {
    this.checklistName = value;
  };
  setChecklistParty = (value: string) => {
    this.checklistName = value;
  };

  /**
   * @description Возвращает true, если черновик готов к сохранению:
   * заполнено название и все правила прошли валидацию обязательных полей.
   */
  get canSave(): boolean {
    if (!this.checklistName) return false;
    return this.checklistRules.every((rule) => ("simple_rule" in rule ? !!rule.simple_rule : !!rule.check_condition));
  }

  /**
   * @description Инициализирует черновик.
   * Без аргументов — сбрасывает в начальное состояние (режим создания).
   * С аргументом — заполняет данными существующего чек-листа (режим редактирования).
   */
  initDraft = (checklist?: ResponseChecklistDto) => {
    if (checklist) {
      this.editingChecklistId = checklist.id;
      this.checklistName = checklist.name;
      this.checklistDescription = checklist.description ?? "";
      this.checklistDocType = checklist.doc_type ?? "";
      this.checklistParty = checklist.party ?? "";
      this.checklistRules = checklist.rules.map(
        (rule): DraftRule =>
          Object.fromEntries(
            Object.entries(rule).filter(([key, value]) => key !== "created_at" && value !== null)
          ) as DraftRule
      );
    } else {
      this.editingChecklistId = initialDraft.editingChecklistId;
      this.checklistName = initialDraft.checklistName;
      this.checklistDescription = initialDraft.checklistDescription;
      this.checklistDocType = initialDraft.checklistDocType;
      this.checklistParty = initialDraft.checklistParty;
      this.checklistRules = [];
      this.ruleType = initialDraft.ruleType;
    }
  };

  clearDraft = () => this.initDraft();

  submitDraft = async (name?: string, docType?: string, party?: string, rules?: DraftRule[]): Promise<boolean> => {
    this.checklistName = name;
    this.checklistDocType = docType;
    this.checklistParty = party;
    this.checklistRules = rules;
    return this.saveChecklist();
  };

  /** @description Удаляет правило из чек-листа по id */
  removeRuleById = async (ruleId: string): Promise<boolean> => {
    try {
      await this.checklistApi.deleteRule(ruleId);
    } catch (error) {
      console.error("removeRuleById [error]", error);
      return false;
    }
    runInAction(() => {
      this.checklistRules = this.checklistRules.filter((r) => r.id !== ruleId);
    });
    return true;
  };

  /**
   * @description Сохраняет чек-лист.
   * Создание: один запрос — чек-лист с правилами в теле.
   * Редактирование: обновляет метаданные + параллельно удаляет/обновляет/добавляет правила по id.
   */
  saveChecklist = async (): Promise<boolean> => {
    runInAction(() => {
      this.isSaving = true;
    });

    try {
      if (this.editingChecklistId) {
        const checklistId = this.editingChecklistId;

        await this.checklistApi.update(checklistId, {
          name: this.checklistName,
          description: this.checklistDescription || undefined,
          doc_type: this.checklistDocType || undefined,
          party: this.checklistParty || undefined,
        });

        await Promise.all(
          this.checklistRules.map(({ id, ...rule }) =>
            id && !id.startsWith("_local_")
              ? this.checklistApi.updateRule(id, rule)
              : this.checklistApi.addRule(checklistId, rule)
          )
        );
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

      await this.checklistApi.create({
        name: "Копия - " + data.name,
        description: data.description,
        doc_type: data.doc_type,
        party: data.party,
        rules: data.rules.map(
          (rule): PayloadChecklistAddRuleDto =>
            Object.fromEntries(
              Object.entries(rule).filter(([key, value]) => !["id", "created_at"].includes(key) && value !== null)
            ) as PayloadChecklistAddRuleDto
        ),
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
      const response = await api.checklist.get(checklistId);

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
  deleteChecklist = async (checklistId: string) => {
    try {
      await api.checklist.delete(checklistId);

      if (this.editingChecklistId === checklistId) {
        this.clearDraft();
      }

      await this.getChecklists();

      console.log("deleteChecklist [success]");
      return true;
    } catch (error) {
      console.error("deleteChecklist [error]", error);
      return false;
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
      this.clearDraft();
    });
  };
}

export default CheckList;
