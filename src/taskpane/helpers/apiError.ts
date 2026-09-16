import axios from "axios";
import { ResponseErrorDetailDto } from "../api/types";

/** @description Достает detail из тела ответа axios-ошибки бэкенда вида `{ detail: { code, message } }` */
export const getApiErrorDetail = (error: unknown): ResponseErrorDetailDto | undefined =>
  axios.isAxiosError(error)
    ? (error.response?.data as { detail?: ResponseErrorDetailDto } | undefined)?.detail
    : undefined;

/** @description Любой технический сбой запроса: сеть недоступна ИЛИ сервер ответил 5xx (объединяет оба случая) */
export const isServerNetworkError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status >= 500;
};

/** @description Только обрыв связи: запрос ушёл, но ответа не пришло вообще (например, из-за блокировки VPN) */
export const isNetworkConnectivityError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response && !!error.request && !axios.isCancel(error);
