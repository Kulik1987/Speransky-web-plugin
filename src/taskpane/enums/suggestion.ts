export enum LevelOfCriticalEnum {
  "HIGH" = "высокая",
  "MEDIUM" = "средняя",
  "LOW" = "низкая",
}

export enum RecommendationTypeEnum {
  "EDIT" = "edit",
  "DELETE" = "delete",
  "ADD" = "add",
}

export enum InsertPlaceEnum {
  "AFTER" = "After",
  "BEFORE" = "Before",
  "REPLACE" = "Replace",
}

export enum ReviewTypesEnums {
  "GENERAL" = "GENERAL",
  "CUSTOM" = "CUSTOM",
}

export enum ProviderLLMEnums {
  "OPEN_AI" = "openai",
  "GIGA_CHAT" = "gigachat",
  "MISTRAL" = "mistral",
}

export enum SourceTypeEnums {
  "WEB" = "web",
  "PLUGIN" = "plugin",
}

export enum WebUrlEnums {
  "WEB_URL_LOCAL" = "http://localhost:5173",
  "WEB_URL_TEST" = "https://app-test.speransky.legal",
  "WEB_URL_PROD" = "https://app.speransky.legal",
}
