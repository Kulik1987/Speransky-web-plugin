export interface PayloadContractDetectTypeDto {
  llm_provider: "mistral" | "gigachat" | "openai";
  file: File;
  source: "web" | "plugin";
}
