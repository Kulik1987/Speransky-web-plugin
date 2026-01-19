/* global process */
import { makeAutoObservable, runInAction, reaction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import mockParties from "./mock/mockParties";
import mockSuggestions from "./mock/mockSuggestions_1";
import { ContractPartieData, RecommendationRisks } from "../api/types";
import { SourceTypeEnums } from "../enums";

const APP_SET_MOCK = process.env.APP_SET_MOCK === "true";

type SuggestionPropertyT = {
  isDismiss?: boolean;
  isApplyChange?: boolean;
  isApplyComment?: boolean;
};

export type SuggestionT = RecommendationRisks & SuggestionPropertyT;

class SuggestionsStore {
  rootStore: RootStore;

  // Стороны договора
  parties: ContractPartieData[] | null = null;
  partiesError: string | null = null;
  isPartiesProcessing: boolean = false;
  formPartySelected: string | null = null;

  // Анализ и рекомендации
  suggestionsNew: SuggestionT[] | null = null;
  suggestionsError: string | null = null;
  isAnalysisProcessing: boolean = false;

  // Кастомная инструкция пользователя
  formCustomInstructions: string | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    reaction(
      () => this.rootStore.documentStore.documentId,
      (documentId) => {
        if (documentId) {
          this.requestParties(documentId);
        }
      }
    );
  }

  setFormPartySelected = (value: string | null) => {
    this.formPartySelected = value;
  };

  setFormCustomInstructions = (value: string | null) => {
    this.formCustomInstructions = value;
  };

  setSuggestionProperty = (indexSuggestion: number, values: SuggestionPropertyT) => {
    const expand = this.suggestionsNew.map((item, index) => {
      if (index === indexSuggestion) return { ...item, ...values };
      return item;
    });
    this.suggestionsNew = expand;
  };

  /**
   * @description Получает JSON-рекомендации
   */
  getSuggestions = async (retryCount = 0) => {
    const MAX_RETRIES = 60; // Количество повторных запросов при ожидании ответа
    const RETRY_DELAY = 20000; // Интервал запроса 20 секунд

    if (retryCount === 0) {
      runInAction(() => {
        this.suggestionsError = null;
      });
    }

    const documentId = this.rootStore.documentStore.documentId;

    if (!documentId) {
      runInAction(() => {
        this.isAnalysisProcessing = false;
        this.suggestionsNew = null;
      });
      return;
    }

    if (APP_SET_MOCK) {
      runInAction(() => {
        this.suggestionsNew = mockSuggestions;
        this.isAnalysisProcessing = false;
      });
      return;
    }

    try {
      const response = await api.contract.recommendation(documentId);

      const hasData = response.data && response.data.risks && response.data.risks.length > 0;
      const partContract = response.data?.risks?.[0]?.target_snippet_full;
      const partModified = response.data?.risks?.[0]?.new_clause_wording;

      const isDataReady =
        partContract !== null && partContract !== undefined && partModified !== null && partModified !== undefined;

      if (!hasData || !isDataReady) {
        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return this.getSuggestions(retryCount + 1);
        } else {
          runInAction(() => {
            this.suggestionsNew = null;
            this.suggestionsError = "timeout-error";
            this.isAnalysisProcessing = false;
          });
        }
        return;
      }
      console.log("getSuggestions [success]", response.data);

      runInAction(() => {
        this.suggestionsNew = response.data.risks;
        this.isAnalysisProcessing = false;
      });
    } catch (error) {
      const status = error?.response?.status ?? error?.status;
      const isPolling409 = status === 409 && retryCount < MAX_RETRIES;

      if (isPolling409) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.getSuggestions(retryCount + 1);
      }
      console.error("getSuggestions [error]", error);

      runInAction(() => {
        this.suggestionsNew = null;
        this.suggestionsError = "failed-request";
        this.isAnalysisProcessing = false;
      });
    }
  };

  /**
   * @description Создает задачу на анализ договора
   */
  createAnalysisTask = async (): Promise<boolean> => {
    this.clearSuggestions();
    runInAction(() => {
      this.isAnalysisProcessing = true;
    });

    try {
      if (APP_SET_MOCK) {
        console.log("MOCK mode: analysis started");
        return true;
      }

      const documentId = this.rootStore.documentStore.documentId;
      const party = this.formPartySelected;
      const userComment = this.formCustomInstructions;

      if (!documentId) {
        throw new Error("Document not uploaded");
      }

      if (!party) {
        throw new Error("Party not selected");
      }

      const payload = {
        document_id: documentId,
        llm_provider: this.rootStore.menuStore.providerLLM,
        source: SourceTypeEnums.PLUGIN,
        selected_party: party,
        user_comment: userComment || undefined,
      };

      const response = await api.contract.analyze(payload);

      console.log("createAnalysisTask [success]", response.data);

      return response.status === 200 && response.data.status === "accepted";
    } catch (error) {
      console.error("createAnalysisTask [error]", error);

      runInAction(() => {
        this.suggestionsNew = null;
        this.suggestionsError = "failed-request";
        this.isAnalysisProcessing = false;
      });

      return false;
    }
  };

  /**
   * @description Запускает анализ и затем запрос рекомендаций
   */
  runAnalysis = async () => {
    const INITIAL_DELAY = 5000; // 5 секунд перед первым запросом

    const success = await this.createAnalysisTask();

    if (success) {
      if (APP_SET_MOCK) {
        this.getSuggestions();
      } else {
        console.log(`Delay ${INITIAL_DELAY}ms before getting recommendation...`);
        await new Promise((resolve) => setTimeout(resolve, INITIAL_DELAY));
        return this.getSuggestions();
      }
    }
  };

  /**
   * @description Отменяет анализ
   */
  cancelAnalysis = () => {
    runInAction(() => {
      this.isAnalysisProcessing = false;
    });
  };

  // dismissSuggestion = (index: number) => {
  //   if (Array.isArray(this.suggestionsNew)) {
  //     this.suggestionsNew = this.suggestionsNew.filter((_element, indexElement) => index !== indexElement);
  //   }
  // };

  /**
   * @description Запрашивает стороны договора по document_id
   */
  requestParties = async (documentId: string, retryCount = 0) => {
    const MAX_RETRIES = 10; // Количество повторных запросов при ожидании ответа
    const RETRY_DELAY = 5000; // Интервал запроса 5 секунд

    if (retryCount === 0) {
      runInAction(() => {
        this.isPartiesProcessing = true;
        this.partiesError = null;
      });
    }

    try {
      console.log(`requestParties [start] attempt ${retryCount + 1}/${MAX_RETRIES + 1}`);

      if (!documentId) {
        throw new Error("document_id is required");
      }

      const response = APP_SET_MOCK ? { data: mockParties } : await api.contract.parties(documentId);
      const parties = response.data;

      runInAction(() => {
        this.parties = parties && parties.length > 0 ? parties : null;
        this.formPartySelected = parties?.[0].role ?? null;
        this.isPartiesProcessing = false;
        this.partiesError = null;
      });

      console.log("requestParties [success]", { parties });
      return;
    } catch (error) {
      const status = error?.response?.status ?? error?.status;
      const is409Error = status === 409 && retryCount < MAX_RETRIES;

      if (is409Error) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.requestParties(documentId, retryCount + 1);
      } else {
        console.error("requestParties [error]");
        runInAction(() => {
          this.parties = null;
          this.formPartySelected = null;
          this.isPartiesProcessing = false;
          this.partiesError = "failed-to-load-parties";
        });
      }
    }
  };

  get isSuggestionExist() {
    const suggestions = this.suggestionsNew;
    return Array.isArray(suggestions) && suggestions.length > 0 ? true : false;
  }

  /**
   * @description Очищает рекомендации
   */
  clearSuggestions = () => {
    this.suggestionsNew = null;
    this.suggestionsError = null;
  };

  resetStore = () => {
    runInAction(() => {
      this.parties = null;
      this.partiesError = null;
      this.formPartySelected = null;
      this.isPartiesProcessing = false;
      this.suggestionsNew = null;
      this.suggestionsError = null;
      this.isAnalysisProcessing = false;
      this.formCustomInstructions = "";
    });
  };
}

export default SuggestionsStore;
