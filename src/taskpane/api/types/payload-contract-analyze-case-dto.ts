export type PayloadContractAnalyzeCaseDto = {
  llm_provider: "mistral" | "gigachat" | "openai";
  source: "web" | "plugin";
  selected_party?: string | null;
  user_comment?: string | null;
  checklist_id?: string | null;
};
