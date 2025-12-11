/* global process */
import { makeAutoObservable, runInAction } from "mobx";
import type RootStore from ".";
import {
  // ProviderLLMEnums,
  ReviewTypesEnums,
} from "../enums";
import api from "../api/v1";
import { ContractAllRecommendationsResponseT, ContractType } from "../api/v1/contract";
import mockParties from "./mock/mockParties";
import mockSuggestions from "./mock/mockSuggestions_1";

const APP_SET_MOCK = process.env.APP_SET_MOCK === "true";
const APP_SET_ANONYMIZER = process.env.APP_SET_ANONYMIZER === "true";

type SuggestionPropertyT = {
  isDismiss?: boolean;
  isApplyChange?: boolean;
  isApplyComment?: boolean;
};

export type SuggestionT = ContractAllRecommendationsResponseT & SuggestionPropertyT;

class SuggestionsStore {
  rootStore: RootStore;

  suggestionsNew: SuggestionT[] | null = null;

  parties: string[] | null = null;

  getPartiesProcessing: boolean = false;

  contractType: ContractType | null = null;

  contractId: string | null = null;

  formPartySelected: string | null = null;

  formCustomInstructions: string | null = null;

  reviewTypeActive: ReviewTypesEnums | null = null;

  reviewGeneralProcessing: boolean = false;

  reviewCustomProcessing: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
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

  getSuggestions = async (type: ReviewTypesEnums, repeatCount = 0) => {
    const REPEAT_LIMIT = 60; /** Количество повторных запросов при ожидании ответа */
    const POLLING_INTERVAL = 20000; /** Интервал запроса 20 секунд */

    if (!this.contractId) {
      runInAction(() => {
        if (type === ReviewTypesEnums.GENERAL) {
          this.reviewGeneralProcessing = false;
        } else {
          this.reviewCustomProcessing = false;
        }
      });
      return;
    }

    try {
      const response = APP_SET_MOCK
        ? { data: mockSuggestions }
        : await api.contract.getRecommendations(this.contractId);

      if (!response.data || response.data.length === 0) {
        if (repeatCount < REPEAT_LIMIT) {
          setTimeout(() => {
            this.getSuggestions(type, repeatCount + 1);
          }, POLLING_INTERVAL);
        }
        return;
      }

      const { part_contract: partContract, part_modified: partModified } = response.data[0];

      const isNeedRepeatQuery =
        partContract === null || partContract === undefined || partModified === null || partModified === undefined;

      if (isNeedRepeatQuery && REPEAT_LIMIT > repeatCount) {
        setTimeout(() => {
          this.getSuggestions(type, repeatCount + 1);
        }, POLLING_INTERVAL);
      } else {
        runInAction(() => {
          this.suggestionsNew = response.data;
          this.contractId = null;

          if (type === ReviewTypesEnums.GENERAL) {
            this.reviewGeneralProcessing = false;
          } else {
            this.reviewCustomProcessing = false;
          }
        });
      }
    } catch (error) {
      console.error(`Error getting recommendations for doc_id ${this.contractId}:`, error);

      runInAction(() => {
        this.suggestionsNew = null;
        this.contractId = null;

        if (type === ReviewTypesEnums.GENERAL) {
          this.reviewGeneralProcessing = false;
        } else {
          this.reviewCustomProcessing = false;
        }
      });
    }
  };

  createReviewTask = async (type: ReviewTypesEnums): Promise<boolean> => {
    this.clearSuggestions();

    runInAction(() => {
      this.contractId = null;
      this.reviewTypeActive = type;

      if (type === ReviewTypesEnums.GENERAL) {
        this.reviewGeneralProcessing = true;
      } else {
        this.reviewCustomProcessing = true;
      }
    });

    try {
      const { textContractSource, textContractAnonymized } = this.rootStore.documentStore;
      const textContract = APP_SET_ANONYMIZER ? textContractAnonymized : textContractSource;
      const party = this.formPartySelected;

      const basePayload = {
        text_contract: textContract,
        partie: party,
        contract_type: this.contractType,
      };

      let response;

      if (type === ReviewTypesEnums.GENERAL) {
        response = await api.contract.createRecommendationGeneral(basePayload);
      } else {
        response = await api.contract.createRecommendationCustom({
          ...basePayload,
          manual_requrement: this.formCustomInstructions,
        });
      }

      const id = response.data?.id;

      if (id) {
        runInAction(() => {
          this.contractId = id;
        });
        return true;
      } else {
        throw new Error("Task ID not received from server");
      }
    } catch (error) {
      console.error(`Error creating ${type} review task:`, error);

      runInAction(() => {
        this.contractId = null;
        this.suggestionsNew = null;

        if (type === ReviewTypesEnums.GENERAL) {
          this.reviewGeneralProcessing = false;
        } else {
          this.reviewCustomProcessing = false;
        }
      });

      return false;
    }
  };

  cancelReview = () => {
    runInAction(() => {
      this.contractId = null;
      this.reviewGeneralProcessing = false;
      this.reviewCustomProcessing = false;
    });
  };

  startReviewGeneral = async () => {
    const success = await this.createReviewTask(ReviewTypesEnums.GENERAL);
    if (success && this.contractId) {
      await this.getSuggestions(ReviewTypesEnums.GENERAL);
    }
  };

  startReviewCustom = async () => {
    const success = await this.createReviewTask(ReviewTypesEnums.CUSTOM);
    if (success && this.contractId) {
      await this.getSuggestions(ReviewTypesEnums.CUSTOM);
    }
  };

  // dismissSuggestion = (index: number) => {
  //   if (Array.isArray(this.suggestionsNew)) {
  //     this.suggestionsNew = this.suggestionsNew.filter((_element, indexElement) => index !== indexElement);
  //   }
  // };

  requestParties = async () => {
    try {
      this.getPartiesProcessing = true;
      const { textContractSource, textContractAnonymized } = this.rootStore.documentStore;
      const textContract = APP_SET_ANONYMIZER ? textContractAnonymized : textContractSource;

      console.log("requestParties [start]", { textContract });

      if (textContract) {
        const response = APP_SET_MOCK
          ? { data: mockParties }
          : await api.contract.parties({
              // llm_provider: this.rootStore.menuStore.providerLLM,
              // llm_provider: (process.env.APP_LLM_MODEL as ProviderLLMEnums) ?? this.rootStore.menuStore.providerLLM,
              text_contract: textContract,
            });
        const { parties, contract_type } = response.data;
        runInAction(() => {
          this.parties = parties || null;
          this.contractType = contract_type || null;
          this.formPartySelected = parties?.[0] ?? null;
        });
      }
      return "";
    } catch (error) {
      this.getPartiesProcessing = false;
      return "error";
    } finally {
      this.getPartiesProcessing = false;
      console.log("requestParties [final]");
    }
  };

  get isSuggestionExist() {
    const suggestions = this.suggestionsNew;
    return Array.isArray(suggestions) && suggestions.length > 0 ? true : false;
  }

  clearSuggestions = () => {
    this.suggestionsNew = null;
  };

  resetStore = () => {
    this.suggestionsNew = null;
    this.reviewTypeActive = null;
  };
}

export default SuggestionsStore;
