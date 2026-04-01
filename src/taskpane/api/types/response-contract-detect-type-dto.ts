export interface ResponseContractDetectTypeDto {
  legal_case_id: string;
  documents: ContractData[];
  document_id: string;
}

interface ContractData {
  document_id: string;
  file_name: string;
}
