import { autorun, makeAutoObservable } from "mobx";
import type RootStore from ".";
import { ProviderLLMEnums } from "../enums";

export enum MenuItemsEnums {
  "DRAFT" = "DRAFT",
  "REVIEW" = "REVIEW",
}

export enum LocaleEnums {
  "RU" = "ru",
  "EN" = "en",
}

class MenuStore {
  rootStore: RootStore;

  locale: LocaleEnums = LocaleEnums.RU;

  providerLLM: ProviderLLMEnums = ProviderLLMEnums.OPEN_AI;

  currentMenuItem: MenuItemsEnums | null = MenuItemsEnums.REVIEW;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    autorun(() => {
      const locale = localStorage.getItem("speransky_locale");
      if (locale && Object.values(LocaleEnums).includes(locale as LocaleEnums)) {
        this.locale = locale as LocaleEnums;
      }

      const providerLLM = localStorage.getItem("speransky_provider_llm");
      if (providerLLM && Object.values(ProviderLLMEnums).includes(providerLLM as ProviderLLMEnums)) {
        this.providerLLM = providerLLM as ProviderLLMEnums;
      }
    });
  }

  setMenuItem = (menuItem: MenuItemsEnums | null) => {
    this.currentMenuItem = menuItem;
  };

  setLocale = (locale: LocaleEnums) => {
    localStorage.setItem("speransky_locale", locale);
    this.locale = locale;
  };

  setProviderLLM = (provider: ProviderLLMEnums) => {
    localStorage.setItem("speransky_provider_llm", provider);
    this.providerLLM = provider;
  };
}

export default MenuStore;
