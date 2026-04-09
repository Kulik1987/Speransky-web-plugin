import { makeAutoObservable, runInAction, autorun } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import { setAuthRefreshFunction } from "../api/instanceAxios";
import { ResponseJwtMeDto } from "../api/types";

export enum AuthStepperEnum {
  EMAIL = "auth.email", // экран запроса email
  PIN = "auth.pin", // экран запроса pin
  ACCESSED = "access.success", // есть доступ к анализу договора
  FORBIDDEN = "access.forbidden", // отсутствует доступ к анализу договора
  ERROR = "request.error", // ошибка авторизации
}

const initialState = {
  clientId: null as string | null,
  clientEmail: "",
  clientData: null as ResponseJwtMeDto | null,
  authStatus: AuthStepperEnum.EMAIL,
  isClientVerify: false,
  isClientDataLoaded: false,
  isFetchingRunSignIn: false,
};

class AuthStore {
  rootStore: RootStore;

  STORAGE_KEY = "speransky-plugin";

  private authApi = api.auth;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    setAuthRefreshFunction(this.authApi.jwtRefresh);
    this.loadStorageState();

    autorun(() => {
      this.saveStorageState();
    });

    this.initAuth();
  }

  accessToken = localStorage.getItem("access_token") || "";
  setAccessToken = (token: string) => {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  };

  refreshToken = localStorage.getItem("refresh_token") || "";
  setRefreshToken = (token: string) => {
    this.refreshToken = token;
    if (token) {
      localStorage.setItem("refresh_token", token);
    } else {
      localStorage.removeItem("refresh_token");
    }
  };

  clientId: string | null = initialState.clientId;
  setClientId = (id: string | null) => {
    this.clientId = id;
  };

  clientEmail: string = initialState.clientEmail;
  setClientEmail = (email: string) => {
    this.clientEmail = email;
  };

  clientData: ResponseJwtMeDto | null = initialState.clientData;
  setClientData = (data: ResponseJwtMeDto) => {
    this.clientData = data;
  };

  authStatus: AuthStepperEnum = initialState.authStatus;
  setAuthStatus = (step: AuthStepperEnum) => {
    this.authStatus = step;
  };

  isClientVerify: boolean = initialState.isClientVerify;
  setIsClientVerify = (value: boolean) => {
    this.isClientVerify = value;
  };

  isClientDataLoaded: boolean = initialState.isClientDataLoaded;
  setIsClientDataLoaded = (value: boolean) => {
    this.isClientDataLoaded = value;
  };

  isFetchingRunSignIn: boolean = initialState.isFetchingRunSignIn;
  setIsFetchingRunSignIn = (value: boolean) => {
    this.isFetchingRunSignIn = value;
  };

  /** @description инициализация авторизации при загрузке плагина */
  initAuth = async () => {
    const hasRefreshToken = !!this.refreshToken;

    if (!hasRefreshToken || !this.isClientVerify) {
      return;
    }

    try {
      if (this.accessToken) {
        await this.runCheckCanUsePlugin();
        await this.runGetClientData();
      } else {
        const { data } = await this.authApi.jwtRefresh(this.refreshToken);
        runInAction(() => {
          this.setAccessToken(data.access_token);
        });
        await this.runCheckCanUsePlugin();
        await this.runGetClientData();
      }
    } catch (error) {
      console.error("initAuth: Error fetching client data", error);
      await this.logout();
    }
  };

  /** @description загрузка состояния store из localStorage плагина */
  loadStorageState = () => {
    const storageRaw = localStorage.getItem(this.STORAGE_KEY);
    if (!storageRaw) return;

    try {
      if (!this.refreshToken) {
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      const storage = JSON.parse(storageRaw);
      const { isClientVerify, clientEmail, authStatus } = storage;

      if (isClientVerify) {
        runInAction(() => {
          this.setIsClientVerify(isClientVerify);
          this.setClientEmail(clientEmail);
          this.setAuthStatus(authStatus);
        });
      }
    } catch (error) {
      console.error("Failed to parse storage", error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  };

  /** @description сохранение состояния store в localStorage плагина */
  saveStorageState = () => {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        isClientVerify: this.isClientVerify,
        clientEmail: this.clientEmail,
        authStatus: this.authStatus,
      })
    );
  };

  /** @description запуск авторизации (проверка существования клиента и отправка OTP) */
  runSignIn = async (email: string) => {
    try {
      this.setIsFetchingRunSignIn(true);
      const { data } = await this.authApi.clientCheck(email);

      /** клиент существует - переходим к проверке pin code */
      if (data?.exists) {
        await this.getOtpCode(email);
        this.setClientEmail(email);
      }
    } catch (error) {
      console.error("clientCheck", error);

      const status = error?.response?.status;
      if (status === 404) {
        throw { type: "NOT_FOUND", message: error.message };
      } else {
        this.setAuthStatus(AuthStepperEnum.ERROR);
        throw error;
      }
    } finally {
      this.setIsFetchingRunSignIn(false);
    }
  };

  /** @description отправка OTP кода на email */
  getOtpCode = async (email: string) => {
    try {
      const responseOtpSend = await this.authApi.otpSend(email);
      const { client_id, was_sent } = responseOtpSend.data;
      if (client_id && was_sent) {
        this.setClientId(responseOtpSend.data.client_id);
        this.setAuthStatus(AuthStepperEnum.PIN);
      }
    } catch (error) {
      console.error("getOtpCode", error);
      throw error;
    }
  };

  /** @description проверка OTP кода и получение токенов */
  checkOtpCode = async (code: string) => {
    try {
      const { data } = await this.authApi.otpVerify(this.clientId as string, code);
      if (data?.access_token) {
        runInAction(() => {
          this.setAccessToken(data.access_token);
          this.setRefreshToken(data.refresh_token);
        });

        await this.runCheckCanUsePlugin();
        await this.runGetClientData();

        runInAction(() => {
          this.setIsClientVerify(true);
        });

        return { status: "success", message: "Проверка otp кода прошла успешно" };
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      return { status: "error", message: "Ошибка проверки otp кода", error };
    }
  };

  /** @description проверка доступа к плагину */
  runCheckCanUsePlugin = async () => {
    try {
      const { data } = await this.authApi.canUsePlugin();
      runInAction(() => {
        this.setIsClientDataLoaded(true);
      });

      if (data.can_use) {
        this.setAuthStatus(AuthStepperEnum.ACCESSED);
      } else {
        this.setAuthStatus(AuthStepperEnum.FORBIDDEN);
      }
    } catch (error) {
      console.error("checkCanUsePlugin", error);
      throw error;
    }
  };

  /** @description получение данных клиента */
  runGetClientData = async () => {
    try {
      const { data } = await this.authApi.jwtClientData();
      runInAction(() => {
        this.setClientData(data as ResponseJwtMeDto);
        this.setIsClientDataLoaded(true);
      });
    } catch (error) {
      console.error("getClientData", error);
      throw error;
    }
  };

  /** @description выход из системы */
  logout = async () => {
    try {
      if (this.refreshToken) {
        await this.authApi.jwtLogout(this.refreshToken);
      }
    } catch (error) {
      console.error("logout error", error);
    } finally {
      this.setAccessToken("");
      this.setRefreshToken("");
      this.resetStore();
    }
  };

  resetStore = () => {
    Object.assign(this, initialState);
  };
}

export default AuthStore;
