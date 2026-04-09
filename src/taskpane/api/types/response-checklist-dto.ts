import { ResponseChecklistAddRuleDto } from "./response-checklist-add-rule-dto";

export interface ResponseChecklistDto {
  id: string;
  name: string;
  description: string;
  doc_type: string;
  party: string;
  created_at: string;
  rules: ResponseChecklistAddRuleDto[];
}
