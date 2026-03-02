export enum RiskLevel {
  "LOW" = "low",
  "MEDIUM" = "medium",
  "HIGH" = "high",
}

interface SimpleRule {
  simple_rule: string;
  risk_level: RiskLevel;
  risk_trigger?: string;
}

interface AdvancedRule {
  check_condition: string;
  required_action?: string;
  required_formulation?: string;
  why_important?: string;
  counterparty_explanation?: string;
  risk_trigger?: string;
  risk_level: RiskLevel;
}

export type PayloadChecklistAddRuleDto = SimpleRule | AdvancedRule;
