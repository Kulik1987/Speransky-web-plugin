export interface ResponseContractMetaDto {
  contract_type: {
    contract_type: string;
    contract_subtype: string | null;
    mixed: boolean;
    components: any[];
  };
  parties: ContractPartieData[];
}

export interface ContractPartieData {
  name: string;
  role: string;
}
