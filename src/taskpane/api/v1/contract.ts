import axios from "../instanceAxios";
import { CONTRACT_ROUTES } from "../routes";
import {
  PayloadContractAnalyzeDto,
  PayloadContractDetectTypeDto,
  ResponseContractAnalyzeDto,
  ResponseContractDetectTypeDto,
  ResponseContractPartiesDto,
  ResponseContractRecommendationDto,
} from "../types";

const contract = {
  /** @description Загрузка договора и определение его типа */
  detectType: (data: PayloadContractDetectTypeDto) => {
    return axios.post<ResponseContractDetectTypeDto>(CONTRACT_ROUTES.detectType, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** @description Запуск анализа договора */
  analyze: (data: PayloadContractAnalyzeDto) => {
    const body = new URLSearchParams();

    body.append("document_id", data.document_id);
    body.append("llm_provider", data.llm_provider);
    body.append("source", data.source);

    if (data.selected_party) {
      body.append("selected_party", data.selected_party);
    }

    if (data.user_comment) {
      body.append("user_comment", data.user_comment);
    }

    return axios.post<ResponseContractAnalyzeDto>(CONTRACT_ROUTES.analyze, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  /** @description Извлечение сторон договора */
  parties: (legal_case_id: string) => {
    return axios.get<ResponseContractPartiesDto>(CONTRACT_ROUTES.parties(legal_case_id));
  },

  /** @description Получение JSON-рекомендаций по id */
  recommendation: (document_id: string) => {
    return axios.get<ResponseContractRecommendationDto>(CONTRACT_ROUTES.recommendation(document_id));
  },

  /** @description Получение ZIP-архива с результатами анализа */
  archive: (
    document_id: string,
    includeReport?: boolean,
    includeReview?: boolean,
    includeProtocol?: boolean,
    config?: { signal?: AbortSignal }
  ) => {
    return axios.get<Blob>(CONTRACT_ROUTES.archive(document_id), {
      params: {
        includeReport,
        includeReview,
        includeProtocol,
      },
      headers: {
        Accept: "application/json",
      },
      responseType: "blob",
      signal: config?.signal,
    });
  },
};

export default contract;
