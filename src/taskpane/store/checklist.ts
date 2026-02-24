import { makeAutoObservable, runInAction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import { ChecklistShortInfo, PayloadChecklistAddRuleDto } from "../api/types";

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
    });
  };
}

export default CheckList;
