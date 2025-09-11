import { LevelOfCriticalEnum, ProviderLLMEnums } from "../../enums";
import axios from "../instanceAxios";
import {
  PLUGIN_CONTRACT_PARTIES,
  PLUGIN_CONTRACT_RECOMMENDATION_GENERAL,
  PLUGIN_CONTRACT_RECOMMENDATION_CUSTOM,
} from "../routes";

export type ContractPartiesPayloadT = {
  llm_provider: ProviderLLMEnums;
  text_contract: string;
};

export type ContractType = {
  contract_type: string;
  contract_subtype: string | null;
  mixed: boolean;
  components: any[];
};

export type ContractRecommendationGeneralPayloadT = {
  llm_provider: ProviderLLMEnums;
  id?: string | undefined;
  partie: string;
  text_contract: string;
  contract_type: ContractType;
};

export type ContractRecommendationCustomPayloadT = {
  llm_provider: ProviderLLMEnums;
  id?: string | undefined;
  partie: string;
  text_contract: string;
  manual_requrement: string;
  contract_type: ContractType;
};

export type ContractPartiesResponseT = {
  parties: string[];
  questions: string[];
  contract_type: ContractType;
};

export type ContractRecommendationResponseT = {
  id?: string;
  level_risk: LevelOfCriticalEnum;
  part_contract: string;
  part_modified: string;
  comment: string;
  type: string;
};

const contract = {
  parties: (data: ContractPartiesPayloadT) => {
    return axios.post<ContractPartiesResponseT>(PLUGIN_CONTRACT_PARTIES, data);
  },

  recommendationGeneral: (data: ContractRecommendationGeneralPayloadT) => {
    return axios.post<ContractRecommendationResponseT[]>(PLUGIN_CONTRACT_RECOMMENDATION_GENERAL, data);
  },

  recommendationCustom: (data: ContractRecommendationCustomPayloadT) => {
    return axios.post<ContractRecommendationResponseT[]>(PLUGIN_CONTRACT_RECOMMENDATION_CUSTOM, data);
  },
};

export default contract;
