export enum RiskLevel {
  "LOW" = "low",
  "MEDIUM" = "medium",
  "HIGH" = "high",
}

interface RiskTriggerItem {
  risk_level: RiskLevel;
  risk_trigger: string;
}

interface SimpleRule {
  simple_rule: string;
  risk_triggers: RiskTriggerItem[] | null;
}

interface AdvancedRule {
  check_condition: string;
  required_action?: string;
  required_formulation?: string;
  why_important?: string;
  counterparty_explanation?: string;
  risk_triggers: RiskTriggerItem[] | null;
}

export type PayloadChecklistAddRuleDto = SimpleRule | AdvancedRule;
