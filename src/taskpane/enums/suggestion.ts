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
  "GENERAL" = "general",
  "CUSTOM" = "custom",
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

export enum AnalysisErrorCodeEnum {
  "CHECKLIST_CONTRACT_TYPE_MISMATCH" = "CHECKLIST_CONTRACT_TYPE_MISMATCH",
}

export enum ChecklistErrorCodeEnum {
  "IN_USE_BY_RUNNING_ANALYSIS" = "CHECKLIST_IN_USE_BY_RUNNING_ANALYSIS",
}

export enum SuggestionsErrorTagEnum {
  "TIMEOUT_ERROR" = "timeout-error",
  "SERVER_ERROR" = "server-error",
  "FAILED_REQUEST" = "failed-request",
  "CHECKLIST_CONTRACT_TYPE_MISMATCH" = "checklist-contract-type-mismatch",
}

export enum WebUrlEnums {
  "WEB_URL_LOCAL" = "http://localhost:5173",
  "WEB_URL_TEST" = "https://app-test.speransky.legal",
  "WEB_URL_PROD" = "https://app.speransky.legal",
}
