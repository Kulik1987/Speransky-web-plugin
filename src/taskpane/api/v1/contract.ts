import {
  LevelOfCriticalEnum,
  RecommendationTypeEnum,
  // ProviderLLMEnums
} from "../../enums";
import axios from "../instanceAxios";
import {
  PLUGIN_CONTRACT_PARTIES,
  PLUGIN_CONTRACT_RECOMMENDATION_GENERAL,
  PLUGIN_CONTRACT_RECOMMENDATION_CUSTOM,
} from "../routes";

export type ContractPartiesPayloadT = {
  // llm_provider: ProviderLLMEnums;
  text_contract: string;
};

export type ContractType = {
  contract_type: string;
  contract_subtype: string | null;
  mixed: boolean;
  components: any[];
};

export type ContractRecommendationGeneralPayloadT = {
  // llm_provider: ProviderLLMEnums;
  partie: string;
  text_contract: string;
  contract_type: ContractType;
};

type ContractRecommendationCustomPayloadT = ContractRecommendationGeneralPayloadT & {
  manual_requrement: string;
};

export type ContractPartiesResponseT = {
  parties: string[];
  questions: string[];
  contract_type: ContractType;
};

export type ContractRecommendationIdResponseT = {
  id: string;
};

export type ContractAllRecommendationsResponseT = {
  level_risk: LevelOfCriticalEnum;
  part_contract: string;
  part_modified: string;
  comment: string;
  type: RecommendationTypeEnum;
};

const contract = {
  /** @description Извлечение сторон договора */
  parties: (data: ContractPartiesPayloadT) => {
    return axios.post<ContractPartiesResponseT>(PLUGIN_CONTRACT_PARTIES, data);
  },

  /** @description Создание задачи анализа договора */
  createRecommendationGeneral: (data: ContractRecommendationGeneralPayloadT) => {
    return axios.post<ContractRecommendationIdResponseT>(PLUGIN_CONTRACT_RECOMMENDATION_GENERAL, data);
  },

  /** @description Создание задачи анализа договора с пользовательскими инструкциями */
  createRecommendationCustom: (data: ContractRecommendationCustomPayloadT) => {
    return axios.post<ContractRecommendationIdResponseT>(PLUGIN_CONTRACT_RECOMMENDATION_CUSTOM, data);
  },

  /** @description Получение готовых рекомендаций по id */
  getRecommendations: (task_id: string) => {
    return axios.get<ContractAllRecommendationsResponseT[]>(`${PLUGIN_CONTRACT_RECOMMENDATION_GENERAL}/${task_id}`);
  },
};

export default contract;
