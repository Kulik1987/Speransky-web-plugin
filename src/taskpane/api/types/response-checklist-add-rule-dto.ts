import { RiskLevel } from "./payload-checklist-add-rule-dto";

export interface ResponseChecklistAddRuleDto {
  id: string;
  created_at: string;
  risk_level: RiskLevel;
  simple_rule?: string | null;
  check_condition?: string | null;
  required_action?: string | null;
  required_formulation?: string | null;
  why_important?: string | null;
  counterparty_explanation?: string | null;
  risk_trigger?: string | null;
}
