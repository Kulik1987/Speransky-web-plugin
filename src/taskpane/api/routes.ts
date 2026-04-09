export const CONTRACT_ROUTES = {
  detectType: "/v1/legal-case/detect-type",
  analyze: "/v1/legal-case/analyze",
  meta: (document_id: string) => `/v1/legal-case/document/${document_id}/meta`,
  recommendation: (document_id: string) => `/v1/legal-case/document/${document_id}/recommendation`,
  archive: (document_id: string) => `/v1/legal-case/document/${document_id}/archive`,
} as const;

export const AUTH_CLIENT_EXISTS = "/v1/client";
export const CLIENT_CAN_USE_PLUGIN = "/v1/client/can-use-plugin";

export const AUTH_OTP_SEND = "/v1/auth";
export const AUTH_OTP_VERIFY = "/v1/auth/verify";

export const AUTH_JWT_REFRESH = "/v1/auth/jwt/refresh";
export const AUTH_JWT_LOGOUT = "/v1/auth/jwt/logout";
export const AUTH_JWT_CLIENT_DATA = "/v1/auth/jwt/me";

export const CHECKLIST_ROUTES = {
  checklists: "/v1/checklists/",
  checklistById: (checklist_id: string) => `/v1/checklists/${checklist_id}`,
  rules: (checklist_id: string) => `/v1/checklists/${checklist_id}/rules`,
  ruleById: (rule_id: string) => `/v1/checklists/rules/${rule_id}`,
};
