import axios from "../instanceAxios";
import {
  AUTH_CLIENT_EXISTS,
  AUTH_JWT_CLIENT_DATA,
  AUTH_JWT_LOGOUT,
  AUTH_JWT_REFRESH,
  AUTH_OTP_SEND,
  AUTH_OTP_VERIFY,
  CLIENT_CAN_USE_PLUGIN,
} from "../routes";
import {
  ResponseClientCanUsePluginDto,
  ResponseClientCheckDto,
  ResponseJwtMeDto,
  ResponseJwtRefreshDto,
  ResponseOtpSendDto,
  ResponseOtpVerifyDto,
} from "../types";

const auth = {
  /** @description Проверка существования клиента по email */
  clientCheck: (email: string) => {
    return axios.get<ResponseClientCheckDto>(AUTH_CLIENT_EXISTS, {
      params: {
        email,
      },
    });
  },

  /** @description Отправка OTP-кода на email клиента */
  otpSend: (email: string) => {
    return axios.get<ResponseOtpSendDto>(AUTH_OTP_SEND, {
      params: { email },
    });
  },

  /** @description Проверка OTP и подтверждение клиента с получением токена */
  otpVerify: (client_id: string, otp: string) => {
    return axios.get<ResponseOtpVerifyDto>(AUTH_OTP_VERIFY, {
      params: {
        client_id,
        otp,
      },
    });
  },

  /** @description Обновление access-токена по действующему refresh-токену */
  jwtRefresh: (refresh_token: string) => {
    return axios.post<ResponseJwtRefreshDto>(AUTH_JWT_REFRESH, null, {
      params: {
        refresh_token,
      },
    });
  },

  /** @description Деактивация refresh-токена (выход из системы) */
  jwtLogout: (refresh_token: string) => {
    return axios.post<string>(AUTH_JWT_LOGOUT, null, {
      params: {
        refresh_token,
      },
    });
  },

  /** @description Проверка JWT-токена и возвращение информации о клиенте */
  jwtClientData: () => {
    return axios.get<ResponseJwtMeDto>(AUTH_JWT_CLIENT_DATA);
  },

  /** @description Проверка доступен ли клиенту плагин */
  canUsePlugin: () => {
    return axios.get<ResponseClientCanUsePluginDto>(CLIENT_CAN_USE_PLUGIN);
  },
};

export default auth;
