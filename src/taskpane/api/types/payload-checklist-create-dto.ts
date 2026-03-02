import { PayloadChecklistAddRuleDto } from "./payload-checklist-add-rule-dto";

export interface PayloadChecklistCreateDto {
  name: string;
  description?: string;
  doc_type?: string;
  party?: string;
  rules: PayloadChecklistAddRuleDto[];
}
