export interface PayloadContractDetectTypeDto {
  llm_provider: "mistral" | "gigachat" | "openai";
  files: File[];
  source: "web" | "plugin";
}
