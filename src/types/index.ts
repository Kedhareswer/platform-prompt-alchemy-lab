// Core Types and Interfaces for Enhanced Prompt Optimizer

export interface User {
  id: string;
  preferences: UserPreferences;
  usage: UsageMetrics;
}

export interface UserPreferences {
  defaultMode: OptimizationMode;
  defaultTechniques: OptimizationOptions;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  notifications: boolean;
}

export interface UsageMetrics {
  totalOptimizations: number;
  successfulOptimizations: number;
  averageImprovement: number;
  favoriteMode: OptimizationMode;
  lastUsed: Date;
}

export type OptimizationMode = "normal" | "context" | "emotional";

export interface OptimizationOptions {
  useChainOfThought: boolean;
  useTreeOfThoughts: boolean;
  useSelfConsistency: boolean;
  useReAct: boolean;
  usePersona: boolean;
  useConstraints: boolean;
  optimizeForTokens: boolean;
  useContextPrompting: boolean;
  useFewShot: boolean;
  useEmotionalPrompting: boolean;
  useRolePlay: boolean;
}

export interface PromptAnalysis {
  id: string;
  timestamp: Date;
  originalPrompt: string;
  quality: PromptQualityScore;
  suggestions: OptimizationSuggestion[];
  context: ContextAnalysis;
  emotional: EmotionalAnalysis;
}

export interface PromptQualityScore {
  clarity: number;
  specificity: number;
  effectiveness: number;
  overall: number;
  issues: QualityIssues;
}

export interface QualityIssues {
  isVague: boolean;
  isOverlyBroad: boolean;
  lacksContext: boolean;
  hasAmbiguity: boolean;
  suggestions: string[];
}

export interface OptimizationSuggestion {
  type: 'technique' | 'context' | 'emotional' | 'structure';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

export interface ContextAnalysis {
  detected: DetectedContext;
  missing: MissingContext[];
  relevance: number;
  suggestions: ContextSuggestion[];
}

export interface DetectedContext {
  domain: string;
  intent: string;
  audience: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  scope: 'narrow' | 'broad' | 'comprehensive';
}

export interface MissingContext {
  type: 'background' | 'constraints' | 'examples' | 'format' | 'audience';
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ContextSuggestion {
  type: string;
  content: string;
  reasoning: string;
}

export interface EmotionalAnalysis {
  tone: EmotionalTone;
  intensity: EmotionalIntensity;
  appropriateness: number;
  effectiveness?: number;
  warnings: string[];
  suggestions: EmotionalTone[];
}

export type EmotionalTone = 
  | 'neutral' 
  | 'professional' 
  | 'encouraging' 
  | 'confident' 
  | 'urgent' 
  | 'empathetic' 
  | 'enthusiastic' 
  | 'supportive';

export type EmotionalIntensity = 'subtle' | 'moderate' | 'strong';

export interface OptimizationResult {
  id: string;
  timestamp: Date;
  originalPrompt: string;
  optimizedPrompt: string;
  mode: OptimizationMode;
  appliedTechniques: string[];
  analysis: ResultAnalysis;
  tokenCount: TokenAnalysis;
  performance: PerformanceMetrics;
}

export interface ResultAnalysis {
  complexity: string;
  intent: string;
  domain: string;
  estimatedImprovement: number;
  strengths: string[];
  weaknesses: string[];
  recommendedFollowUp: string[];
}

export interface TokenAnalysis {
  original: number;
  optimized: number;
  saved: number;
  efficiency: number;
}

export interface PerformanceMetrics {
  processingTime: number;
  apiCalls: number;
  cacheHits: number;
  successRate: number;
}

export interface OptimizationSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  prompts: PromptAnalysis[];
  results: OptimizationResult[];
  totalImprovement: number;
  userSatisfaction?: number;
}

export interface APIConfiguration {
  provider: 'cohere' | 'openai' | 'anthropic' | 'local';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  retryAttempts: number;
}

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: Date;
  ttl: number;
  hits: number;
}

export interface ErrorInfo {
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  recovered: boolean;
}

export interface AppState {
  user: User | null;
  currentSession: OptimizationSession | null;
  cache: Map<string, CacheEntry<any>>;
  errors: ErrorInfo[];
  loading: boolean;
  connected: boolean;
}