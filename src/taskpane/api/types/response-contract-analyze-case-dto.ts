export interface ResponseContractAnalyzeCaseDto {
  status: string;
  recommendations: RecommendationDetails[];
}

interface RecommendationDetails {
  document_id: string;
  recommendation_id: string;
}
