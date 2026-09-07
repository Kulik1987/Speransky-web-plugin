import axios from "axios";
import { ResponseErrorDetailDto } from "../api/types";

/** @description Достает detail из тела ответа axios-ошибки бэкенда вида `{ detail: { code, message } }` */
export const getApiErrorDetail = (error: unknown): ResponseErrorDetailDto | undefined =>
  axios.isAxiosError(error)
    ? (error.response?.data as { detail?: ResponseErrorDetailDto } | undefined)?.detail
    : undefined;

/** @description Технический сбой запроса: сеть недоступна или сервер ответил 5xx */
export const isServerNetworkError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status >= 500;
};
