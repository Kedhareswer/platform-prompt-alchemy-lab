import { EnhancedPromptAnalysis } from './advancedPromptEngine';

// Quality prediction model based on prompt characteristics
export interface QualityPredictionModel {
  effectiveness: number;
  confidence: number;
  riskFactors: string[];
  successFactors: string[];
  improvementPotential: number;
}

// Learning system for improving predictions based on user feedback
export interface FeedbackData {
  promptId: string;
  originalPrediction: QualityPredictionModel;
  actualOutcome: {
    userSatisfaction: number; // 1-10 scale
    actualEffectiveness: number; // 1-100 scale
    comments?: string;
  };
  timestamp: Date;
}

export class QualityPredictor {
  private static feedbackHistory: FeedbackData[] = [];
  private static predictionAccuracy: number = 0.75; // Initial accuracy estimate

  // Predict prompt quality using multiple factors
  static predictQuality(analysis: EnhancedPromptAnalysis): QualityPredictionModel {
    const {
      semanticStructure,
      contextFactors,
      complexity,
      intent,
      identifiedIssues
    } = analysis;

    // Calculate base effectiveness score
    let effectiveness = this.calculateBaseEffectiveness(semanticStructure, contextFactors);

    // Apply complexity adjustments
    effectiveness += this.getComplexityBonus(complexity);

    // Apply intent-specific adjustments
    effectiveness += this.getIntentBonus(intent, contextFactors);

    // Penalize for identified issues
    effectiveness -= this.calculateIssuePenalty(identifiedIssues);

    // Calculate confidence based on analysis certainty
    const confidence = this.calculateConfidence(analysis);

    // Identify risk and success factors
    const riskFactors = this.identifyRiskFactors(analysis);
    const successFactors = this.identifySuccessFactors(analysis);

    // Calculate improvement potential
    const improvementPotential = Math.max(0, 100 - effectiveness);

    return {
      effectiveness: Math.max(0, Math.min(100, effectiveness)),
      confidence: Math.max(0, Math.min(100, confidence)),
      riskFactors,
      successFactors,
      improvementPotential
    };
  }

  // Learn from user feedback to improve predictions
  static recordFeedback(feedback: FeedbackData): void {
    this.feedbackHistory.push(feedback);
    this.updatePredictionAccuracy();
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('qualityPredictorFeedback', JSON.stringify(this.feedbackHistory.slice(-100))); // Keep last 100
    } catch (error) {
      console.warn('Could not save feedback to localStorage:', error);
    }
  }

  // Load historical feedback
  static loadFeedbackHistory(): void {
    try {
      const stored = localStorage.getItem('qualityPredictorFeedback');
      if (stored) {
        this.feedbackHistory = JSON.parse(stored);
        this.updatePredictionAccuracy();
      }
    } catch (error) {
      console.warn('Could not load feedback from localStorage:', error);
    }
  }

  // Get personalized recommendations based on user's feedback history
  static getPersonalizedRecommendations(analysis: EnhancedPromptAnalysis): string[] {
    const recommendations = [];
    const userPatterns = this.analyzeUserPatterns();

    // Recommendations based on user's common issues
    if (userPatterns.commonIssues.includes('clarity')) {
      recommendations.push('Focus on using simpler, clearer language based on your feedback history');
    }

    if (userPatterns.commonIssues.includes('specificity')) {
      recommendations.push('Add more specific details - you\'ve indicated this helps in previous prompts');
    }

    if (userPatterns.preferredTechniques.length > 0) {
      recommendations.push(`Consider using ${userPatterns.preferredTechniques.join(', ')} techniques that worked well for you before`);
    }

    // Domain-specific recommendations
    if (userPatterns.successfulDomains.length > 0) {
      recommendations.push(`Apply patterns from your successful ${userPatterns.successfulDomains[0]} prompts`);
    }

    return recommendations;
  }

  // Private helper methods
  private static calculateBaseEffectiveness(
    semanticStructure: EnhancedPromptAnalysis['semanticStructure'],
    contextFactors: EnhancedPromptAnalysis['contextFactors']
  ): number {
    const semanticScore = (
      semanticStructure.coherence * 0.25 +
      semanticStructure.clarity * 0.3 +
      semanticStructure.completeness * 0.25 +
      semanticStructure.specificity * 0.2
    );

    const contextScore = (
      (contextFactors.hasBackground ? 20 : 0) +
      (contextFactors.hasConstraints ? 25 : 0) +
      (contextFactors.hasExamples ? 15 : 0) +
      (contextFactors.hasGoals ? 25 : 0) +
      (contextFactors.emotionalTone === 'professional' ? 15 : 10)
    );

    return (semanticScore * 0.7) + (contextScore * 0.3);
  }

  private static getComplexityBonus(complexity: string): number {
    const bonuses = {
      'simple': 5,      // Simple prompts are often clearer
      'moderate': 10,   // Sweet spot for most tasks
      'complex': 5,     // Can be effective but harder to execute
      'expert': 0       // High risk, high reward
    };
    return bonuses[complexity as keyof typeof bonuses] || 0;
  }

  private static getIntentBonus(intent: string, contextFactors: any): number {
    let bonus = 0;

    switch (intent) {
      case 'problem_solving':
        bonus = contextFactors.hasConstraints ? 15 : 5;
        break;
      case 'creative':
        bonus = contextFactors.hasExamples ? 10 : 15; // Examples can limit creativity
        break;
      case 'analytical':
        bonus = contextFactors.hasBackground ? 15 : 5;
        break;
      case 'instructional':
        bonus = (contextFactors.hasGoals && contextFactors.hasConstraints) ? 20 : 8;
        break;
      default:
        bonus = 5;
    }

    return bonus;
  }

  private static calculateIssuePenalty(issues: EnhancedPromptAnalysis['identifiedIssues']): number {
    let penalty = 0;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          penalty += 15;
          break;
        case 'medium':
          penalty += 8;
          break;
        case 'low':
          penalty += 3;
          break;
      }
    });

    return penalty;
  }

  private static calculateConfidence(analysis: EnhancedPromptAnalysis): number {
    let confidence = 70; // Base confidence

    // Increase confidence with better semantic structure
    const avgSemantic = (
      analysis.semanticStructure.coherence +
      analysis.semanticStructure.clarity +
      analysis.semanticStructure.completeness +
      analysis.semanticStructure.specificity
    ) / 4;

    confidence += (avgSemantic - 50) * 0.3;

    // Increase confidence with more context
    const contextFactorCount = Object.values(analysis.contextFactors)
      .filter(v => typeof v === 'boolean' ? v : true).length;
    confidence += contextFactorCount * 3;

    // Decrease confidence with more issues
    confidence -= analysis.identifiedIssues.length * 5;

    // Adjust based on our historical accuracy
    confidence *= this.predictionAccuracy;

    return Math.max(20, Math.min(95, confidence));
  }

  private static identifyRiskFactors(analysis: EnhancedPromptAnalysis): string[] {
    const risks = [];

    if (analysis.semanticStructure.clarity < 60) {
      risks.push('Low clarity may lead to misunderstanding');
    }

    if (analysis.semanticStructure.specificity < 50) {
      risks.push('Vague requirements may produce generic responses');
    }

    if (!analysis.contextFactors.hasGoals) {
      risks.push('Lack of clear objectives may result in unfocused output');
    }

    if (analysis.complexity === 'expert' && analysis.semanticStructure.coherence < 70) {
      risks.push('Complex prompt with poor structure increases confusion risk');
    }

    if (analysis.identifiedIssues.filter(i => i.severity === 'high').length > 2) {
      risks.push('Multiple high-severity issues detected');
    }

    return risks;
  }

  private static identifySuccessFactors(analysis: EnhancedPromptAnalysis): string[] {
    const factors = [];

    if (analysis.semanticStructure.coherence > 80) {
      factors.push('Well-structured and coherent prompt');
    }

    if (analysis.semanticStructure.specificity > 75) {
      factors.push('Specific requirements and constraints provided');
    }

    if (analysis.contextFactors.hasBackground && analysis.contextFactors.hasGoals) {
      factors.push('Clear context and objectives established');
    }

    if (analysis.contextFactors.hasExamples) {
      factors.push('Examples provided for better understanding');
    }

    if (analysis.contextFactors.emotionalTone === 'professional') {
      factors.push('Professional tone encourages quality responses');
    }

    if (analysis.complexity === 'moderate' || analysis.complexity === 'complex') {
      factors.push('Appropriate complexity level for detailed responses');
    }

    return factors;
  }

  private static updatePredictionAccuracy(): void {
    if (this.feedbackHistory.length < 5) return; // Need minimum data

    const recentFeedback = this.feedbackHistory.slice(-20); // Last 20 predictions
    let totalAccuracy = 0;

    recentFeedback.forEach(feedback => {
      const predictedEffectiveness = feedback.originalPrediction.effectiveness;
      const actualEffectiveness = feedback.actualOutcome.actualEffectiveness;
      
      // Calculate accuracy as inverse of prediction error
      const error = Math.abs(predictedEffectiveness - actualEffectiveness);
      const accuracy = Math.max(0, 1 - (error / 100));
      totalAccuracy += accuracy;
    });

    this.predictionAccuracy = totalAccuracy / recentFeedback.length;
  }

  private static analyzeUserPatterns(): {
    commonIssues: string[];
    preferredTechniques: string[];
    successfulDomains: string[];
    averageSatisfaction: number;
  } {
    if (this.feedbackHistory.length === 0) {
      return {
        commonIssues: [],
        preferredTechniques: [],
        successfulDomains: [],
        averageSatisfaction: 0
      };
    }

    // Analyze common issues from low-satisfaction feedback
    const lowSatisfactionFeedback = this.feedbackHistory.filter(f => f.actualOutcome.userSatisfaction < 6);
    const commonIssues = this.extractCommonIssues(lowSatisfactionFeedback);

    // Identify successful patterns from high-satisfaction feedback
    const highSatisfactionFeedback = this.feedbackHistory.filter(f => f.actualOutcome.userSatisfaction >= 8);
    const preferredTechniques = this.extractSuccessfulTechniques(highSatisfactionFeedback);
    const successfulDomains = this.extractSuccessfulDomains(highSatisfactionFeedback);

    // Calculate average satisfaction
    const averageSatisfaction = this.feedbackHistory.reduce((sum, f) => sum + f.actualOutcome.userSatisfaction, 0) / this.feedbackHistory.length;

    return {
      commonIssues,
      preferredTechniques,
      successfulDomains,
      averageSatisfaction
    };
  }

  private static extractCommonIssues(feedbackList: FeedbackData[]): string[] {
    // This would analyze feedback comments and prediction data to identify patterns
    // Simplified implementation
    const issues = new Map<string, number>();
    
    feedbackList.forEach(feedback => {
      if (feedback.originalPrediction.riskFactors) {
        feedback.originalPrediction.riskFactors.forEach(risk => {
          if (risk.includes('clarity')) issues.set('clarity', (issues.get('clarity') || 0) + 1);
          if (risk.includes('specific')) issues.set('specificity', (issues.get('specificity') || 0) + 1);
          if (risk.includes('objectives')) issues.set('goals', (issues.get('goals') || 0) + 1);
        });
      }
    });

    return Array.from(issues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([issue]) => issue);
  }

  private static extractSuccessfulTechniques(feedbackList: FeedbackData[]): string[] {
    // Would analyze which techniques led to better outcomes
    // Simplified implementation
    const techniques = ['chain_of_thought', 'expert_domain_injection', 'meta_instruction'];
    return techniques.slice(0, 2); // Return top 2 for simplicity
  }

  private static extractSuccessfulDomains(feedbackList: FeedbackData[]): string[] {
    // Would analyze which domains had the best outcomes
    // Simplified implementation
    return ['technology', 'business']; // Placeholder
  }
}

// Initialize feedback loading when module is imported
QualityPredictor.loadFeedbackHistory();