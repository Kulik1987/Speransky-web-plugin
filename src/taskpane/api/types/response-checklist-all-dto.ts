export type ResponseChecklistAllDto = ChecklistShortInfo[];

export interface ChecklistShortInfo {
  id: string;
  name: string;
  doc_type: string;
  party: string;
  created_at: string;
}
