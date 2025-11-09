import axios from "../instanceAxios";
import {
  PLUGIN_AUTH_CLIENT_EXISTS,
  PLUGIN_AUTH_JWT_CLIENT_DATA,
  PLUGIN_AUTH_JWT_LOGOUT,
  PLUGIN_AUTH_JWT_REFRESH,
  PLUGIN_AUTH_OTP_SEND,
  PLUGIN_AUTH_OTP_VERIFY,
  PLUGIN_CLIENT_CAN_USE_PLUGIN,
} from "../routes";

export type ClientCheckResponseT = {
  exists: boolean;
};

export type OtpSendResponseT = {
  client_id: string;
  was_sent: boolean;
};

export type OtpVerifyResponseT = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
};

export type JwtRefreshResponseT = {
  access_token: string;
  token_type: "Bearer";
};

export type JwtClientDataResponseT = {
  id: string | null;
  mail: string | null;
  name: string | null;
  phone: string | null;
  city: string | null;
  company: string | null;
  position: string | null;
  attempts_left: null;
  unlimited_until: string | null;
  can_use_plugin: boolean;
  create_date: string | null;
};

export type CanUsePluginResponseT = {
  can_use: boolean;
};

const auth = {
  /** @description Проверка существования клиента по email */
  clientCheck: (email: string) => {
    return axios.get<ClientCheckResponseT>(PLUGIN_AUTH_CLIENT_EXISTS, {
      params: {
        email,
      },
    });
  },

  /** @description Отправка OTP-кода на email клиента */
  otpSend: (email: string) => {
    return axios.get<OtpSendResponseT>(PLUGIN_AUTH_OTP_SEND, {
      params: { email },
    });
  },

  /** @description Проверка OTP и подтверждение клиента с получением токена */
  otpVerify: (client_id: string, otp: string) => {
    return axios.get<OtpVerifyResponseT>(PLUGIN_AUTH_OTP_VERIFY, {
      params: {
        client_id,
        otp,
      },
    });
  },

  /** @description Обновление access-токена по действующему refresh-токену */
  jwtRefresh: (refresh_token: string) => {
    return axios.post<JwtRefreshResponseT>(PLUGIN_AUTH_JWT_REFRESH, null, {
      params: {
        refresh_token,
      },
    });
  },

  /** @description Деактивация refresh-токена (выход из системы) */
  jwtLogout: (refresh_token: string) => {
    return axios.post<string>(PLUGIN_AUTH_JWT_LOGOUT, null, {
      params: {
        refresh_token,
      },
    });
  },

  /** @description Проверка JWT-токена и возвращение информации о клиенте */
  jwtClientData: () => {
    return axios.get<JwtClientDataResponseT>(PLUGIN_AUTH_JWT_CLIENT_DATA);
  },

  /** @description Проверка доступен ли клиенту плагин */
  canUsePlugin: () => {
    return axios.get<CanUsePluginResponseT>(PLUGIN_CLIENT_CAN_USE_PLUGIN);
  },
};

export default auth;
