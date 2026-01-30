import { LevelOfCriticalEnum } from "../../enums";

export interface ResponseContractRecommendationDto {
  title: string;
  analysis_date: string;
  contract_name: string;
  parties: {
    party_1_role: string;
    party_2_role: string;
  };
  columns: string[];
  risks: RecommendationRisks[];
}

export interface RecommendationRisks {
  contract_clause_reference: string;
  contract_section: string;
  risk_description: string;
  relevant_party: string;
  risk_level: LevelOfCriticalEnum;
  color: string;
  recommendation: string;
  new_clause_wording: string;
  target_snippet_full: string;
  is_new_clause: boolean;
  is_removed_clause: boolean;
}
