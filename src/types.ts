export type FoodStatus = 'tayyib' | 'khabith' | 'mashbuh';

export interface IngredientItem {
  name: string;
  status: FoodStatus;
  description: string;
}

export interface FoodAnalysisResult {
  id: string;
  name: string;
  status: FoodStatus;
  statusLabel: string;
  statusReason: string;
  detailedReasons: string[];
  scientificEvidence: string;
  islamicEvidence: string;
  ingredientsAnalysis: IngredientItem[];
  consumerAdvice: string;
  timestamp: string;
  sourceType: 'image' | 'text';
  queryText?: string;
  imageThumbnail?: string;
}

export interface ENumberReference {
  code: string;
  name: string;
  status: FoodStatus;
  origin: string;
  explanation: string;
  scientificDetail: string;
}

export interface QuickExample {
  title: string;
  subtitle: string;
  category: FoodStatus;
  query: string;
  iconName: string;
}
