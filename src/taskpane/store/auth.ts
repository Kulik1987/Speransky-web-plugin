import { makeAutoObservable, runInAction, autorun } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import { setAuthRefreshFunction } from "../api/instanceAxios";
import { JwtClientDataResponseT } from "../api/v1/auth";

export enum AuthStepperEnum {
  EMAIL = "auth.email", // экран запроса email
  PIN = "auth.pin", // экран запроса pin
  LOGIN = "auth.login", // экран успешной авторизации
  ACCESSED = "access.success", // есть доступ к анализу договора
  FORBIDDEN = "access.forbidden", // отсутствует доступ к анализу договора
  ERROR = "request.error", // ошибка авторизации
}

const initialState = {
  clientId: null as string | null,
  clientEmail: "",
  clientData: null as JwtClientDataResponseT | null,
  authStatus: AuthStepperEnum.EMAIL,
  isClientVerify: false,
  isClientDataLoaded: false,
  isFetchingRunSignIn: false,
  hasPluginAccess: false,
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

  clientData: JwtClientDataResponseT | null = initialState.clientData;
  setClientData = (data: JwtClientDataResponseT) => {
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

  hasPluginAccess: boolean = initialState.hasPluginAccess;
  setHasPluginAccess = (value: boolean) => {
    this.hasPluginAccess = value;
  };

  /** @description инициализация авторизации при загрузке плагина */
  initAuth = async () => {
    const hasRefreshToken = !!this.refreshToken;

    if (!hasRefreshToken || !this.isClientVerify) {
      return;
    }

    try {
      if (this.accessToken) {
        await this.runGetClientData();
      } else {
        const { data } = await this.authApi.jwtRefresh(this.refreshToken);
        runInAction(() => {
          this.setAccessToken(data.access_token);
        });
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
      const { isClientVerify, clientEmail, authStatus, hasPluginAccess } = storage;

      if (isClientVerify) {
        runInAction(() => {
          this.setIsClientVerify(isClientVerify);
          this.setClientEmail(clientEmail);
          this.setAuthStatus(authStatus);
          this.setHasPluginAccess(hasPluginAccess);
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
        hasPluginAccess: this.hasPluginAccess,
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
      this.setAuthStatus(AuthStepperEnum.ERROR);
      throw error;
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
          this.setAuthStatus(AuthStepperEnum.LOGIN);
          this.setIsClientVerify(true);
        });

        await this.runGetClientData();

        return { status: "success", message: "Проверка otp кода прошла успешно" };
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      runInAction(() => {
        this.setAuthStatus(AuthStepperEnum.ERROR);
      });
      return { status: "error", message: "Ошибка проверки otp кода", error };
    }
  };

  /** @description получение данных клиента и проверка доступа к плагину */
  runGetClientData = async () => {
    try {
      const { data } = await this.authApi.jwtClientData();
      runInAction(() => {
        this.setClientData(data as JwtClientDataResponseT);
        this.setIsClientDataLoaded(true);
      });

      await this.checkPluginAccess();

      // Если у клиента can_use_plugin = true, даем доступ к полному анализу договора
      if (!this.hasPluginAccess) {
        if (data.can_use_plugin) {
          await this.createPluginAccess();
        } else {
          this.setAuthStatus(AuthStepperEnum.FORBIDDEN);
        }
      }
    } catch (error) {
      console.error("getClientData", error);
      throw error;
    }
  };

  /** @description проверка доступа к полному анализу договора */
  checkPluginAccess = async () => {
    try {
      const { data } = await this.authApi.checkAccess(this.clientEmail);
      runInAction(() => {
        if (data.is_access) {
          this.setHasPluginAccess(true);
          this.setAuthStatus(AuthStepperEnum.ACCESSED);
        } else {
          this.setHasPluginAccess(false);
        }
      });
    } catch (error) {
      console.error("checkPluginAccess", error);
    }
  };

  /** @description создание доступа к полному анализу договора */
  createPluginAccess = async () => {
    try {
      const { data } = await this.authApi.createAccess(this.clientEmail);
      if (data.success) {
        runInAction(() => {
          this.setHasPluginAccess(true);
          this.setAuthStatus(AuthStepperEnum.ACCESSED);
        });
      }
    } catch (error) {
      console.error("createPluginAccess", error);
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
      localStorage.removeItem(this.STORAGE_KEY);
      this.resetStore();
    }
  };

  resetStore = () => {
    Object.assign(this, initialState);
  };
}

export default AuthStore;
