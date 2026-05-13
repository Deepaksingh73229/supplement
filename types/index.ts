export interface Ingredient {
  name: string;
  dosage: string;
  dosageMg?: number;
  unit?: string;
  category?: string;
  description?: string;
  isNovel?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  riskReason?: string;
  standardDosage?: string;
  interactions?: string[];
}

export interface FormulationObservation {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  category: 'synergy' | 'redundancy' | 'gap' | 'safety' | 'efficacy' | 'stability';
  severity?: 'low' | 'medium' | 'high';
}

export interface MarketingClaim {
  claim: string;
  isProblematic: boolean;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  suggestion?: string;
}

export interface AnalysisResult {
  id: string;
  productName: string;
  category: string;
  createdAt: string;
  ingredients: Ingredient[];
  observations: FormulationObservation[];
  claims: MarketingClaim[];
  summary: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  overallScore: number;
  aiReview: string;
}

export interface SearchResult {
  ingredient: string;
  description: string;
  similarity: number;
  category: string;
  commonUses: string[];
  typicalDosage: string;
}

export interface GeminiKeyState {
  key: string;
  isSet: boolean;
}

export interface ProductInput {
  productName: string;
  category: string;
  ingredientsText: string;
  marketingClaims?: string;
}
