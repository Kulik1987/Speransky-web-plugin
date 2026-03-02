/* global process */
import { makeAutoObservable, runInAction, reaction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import { mockContractType, mockParties } from "./mock/mockParties";
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

  // Мета-данные договора
  metaDataError: string | null = null;
  isMetaDataProcessing: boolean = false;
  documentType: string | null = null;
  parties: ContractPartieData[] | null = null;
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
          this.requestMetaData(documentId);
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

      const payload = {
        document_id: documentId,
        llm_provider: this.rootStore.menuStore.providerLLM,
        source: SourceTypeEnums.PLUGIN,
        selected_party: party || undefined,
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
   * @description Запрашивает тип и стороны договора по document_id
   */
  requestMetaData = async (documentId: string, retryCount = 0) => {
    const MAX_RETRIES = 15; // Количество повторных запросов при ожидании ответа
    const RETRY_DELAY = 5000; // Интервал запроса 5 секунд

    if (retryCount === 0) {
      runInAction(() => {
        this.isMetaDataProcessing = true;
        this.metaDataError = null;
      });
    }

    try {
      console.log(`requestMetaData [start] attempt ${retryCount + 1}/${MAX_RETRIES + 1}`);

      if (!documentId) {
        throw new Error("document_id is required");
      }

      let documentType: string | null = null;
      let parties: ContractPartieData[] | null = null;

      if (APP_SET_MOCK) {
        documentType = mockContractType;
        parties = mockParties;
      } else {
        const response = await api.contract.meta(documentId);
        documentType = response.data.contract_type.contract_type;
        parties = response.data.parties;
      }

      runInAction(() => {
        this.documentType = documentType ?? null;
        this.parties = parties && parties.length > 0 ? parties : null;
        this.formPartySelected = null;
        this.isMetaDataProcessing = false;
        this.metaDataError = null;
      });

      console.log("requestMetaData [success]", { parties });
      return;
    } catch (error) {
      const status = error?.response?.status ?? error?.status;
      const is409Error = status === 409 && retryCount < MAX_RETRIES;

      if (is409Error) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.requestMetaData(documentId, retryCount + 1);
      } else {
        console.error("requestMetaData [error]");
        runInAction(() => {
          this.parties = null;
          this.formPartySelected = null;
          this.isMetaDataProcessing = false;
          this.metaDataError = "failed-to-load-meta-data";
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
      this.documentType = null;
      this.parties = null;
      this.metaDataError = null;
      this.formPartySelected = null;
      this.isMetaDataProcessing = false;
      this.suggestionsNew = null;
      this.suggestionsError = null;
      this.isAnalysisProcessing = false;
      this.formCustomInstructions = "";
    });
  };
}

export default SuggestionsStore;
