/**
 * Type definitions for BetterPrompt
 */

// Analysis table row for optimization results
export interface AnalysisTableRow {
  dimension: string;
  originalIssue: string;
  optimized: string;
}

// Optimization result from LLM
export interface OptimizationResult {
  optimizedPrompt: {
    zh: string;
    en: string;
  };
  score: number;
  roast: string;
  optimizationDetails: Array<{
    change: string;
    effect: string;
  }>;
  diagnosis: string[];
  analysisTable?: AnalysisTableRow[];
}

// History item stored in localStorage
export interface HistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  result: OptimizationResult;
}

// Model option for model selector
export interface ModelOption {
  id: string;
  value: string;
  label: string;
  isBuiltIn: boolean;
  /** Models that don't require custom API configuration */
  noApiRequired?: boolean;
}

// Settings stored in localStorage
export interface Settings {
  apiBase: string;
  apiKey: string;
  models: ModelOption[];
  selectedModelId: string;
}

// Prompt template for customization
export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  userPromptTemplate: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

// API configuration for dynamic endpoint and auth
export interface ApiConfig {
  apiBase?: string;
  apiKey?: string;
}

// Prompt template options for API calls
export interface PromptOptions {
  systemPrompt?: string;
  userPromptTemplate?: string;
}
