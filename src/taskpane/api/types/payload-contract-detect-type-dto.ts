export interface PayloadContractDetectTypeDto {
  llm_provider: "mistral" | "gigachat" | "openai";
  file?: File | null;
  files?: File[] | null;
  source: "web" | "plugin";
}
