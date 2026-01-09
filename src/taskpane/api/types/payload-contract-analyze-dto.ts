export interface PayloadContractAnalyzeDto {
  llm_provider: "mistral" | "gigachat" | "openai";
  document_id: string;
  source: "web" | "plugin";
  selected_party?: string | null;
  user_comment?: string | null;
}
