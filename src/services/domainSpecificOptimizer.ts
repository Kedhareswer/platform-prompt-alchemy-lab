// Domain-specific optimization patterns and templates
export interface DomainPattern {
  id: string;
  domain: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  effectiveness: number;
  applicableIntents: string[];
}

export interface DomainOptimizationRule {
  domain: string;
  triggers: string[];
  optimizations: {
    structure: string[];
    terminology: string[];
    contextAdditions: string[];
    constraints: string[];
  };
}

export class DomainSpecificOptimizer {
  private static domainPatterns: DomainPattern[] = [
    // Technology Domain Patterns
    {
      id: 'tech_architecture_design',
      domain: 'technology',
      name: 'System Architecture Design',
      description: 'For designing software architecture and system components',
      template: `As a senior software architect, design a {system_type} system that {objective}.

Requirements:
- {requirements}
- Consider scalability, maintainability, and performance
- Include technology stack recommendations
- Address security considerations
- Provide deployment strategy

Please structure your response with:
1. High-level architecture overview
2. Component breakdown and responsibilities
3. Technology stack justification
4. Data flow and integration patterns
5. Security and performance considerations
6. Implementation roadmap`,
      variables: ['system_type', 'objective', 'requirements'],
      effectiveness: 92,
      applicableIntents: ['problem_solving', 'instructional', 'analytical']
    },

    {
      id: 'tech_code_review',
      domain: 'technology',
      name: 'Code Review and Optimization',
      description: 'For code analysis and improvement recommendations',
      template: `As a senior software engineer, review the following {language} code for {purpose}:

{code_snippet}

Please provide a comprehensive code review covering:
1. Code quality and best practices
2. Performance optimizations
3. Security vulnerabilities
4. Maintainability improvements
5. Testing recommendations
6. Refactoring suggestions

For each issue identified, provide:
- Severity level (Critical/High/Medium/Low)
- Specific explanation of the problem
- Detailed solution with code examples
- Best practice explanation`,
      variables: ['language', 'purpose', 'code_snippet'],
      effectiveness: 90,
      applicableIntents: ['analytical', 'problem_solving']
    },

    // Business Domain Patterns
    {
      id: 'business_strategy_analysis',
      domain: 'business',
      name: 'Strategic Business Analysis',
      description: 'For comprehensive business strategy development',
      template: `As a senior management consultant, analyze the {business_situation} for {company_context}.

Context:
- {background_information}
- {current_challenges}
- {objectives}

Please provide a comprehensive strategic analysis including:

1. SITUATION ANALYSIS
   - Market dynamics and competitive landscape
   - Internal capabilities and resources
   - Key challenges and opportunities

2. STRATEGIC OPTIONS
   - Alternative strategic approaches
   - Risk-benefit analysis for each option
   - Resource requirements and feasibility

3. RECOMMENDATIONS
   - Preferred strategic direction with clear rationale
   - Implementation roadmap with timelines
   - Success metrics and KPIs
   - Risk mitigation strategies

4. FINANCIAL IMPLICATIONS
   - Investment requirements
   - Expected ROI and payback period
   - Budget allocation recommendations`,
      variables: ['business_situation', 'company_context', 'background_information', 'current_challenges', 'objectives'],
      effectiveness: 88,
      applicableIntents: ['analytical', 'problem_solving', 'instructional']
    },

    // Creative Domain Patterns
    {
      id: 'creative_storytelling',
      domain: 'creative',
      name: 'Advanced Storytelling Framework',
      description: 'For creating compelling narratives and stories',
      template: `As an award-winning storyteller and creative writer, create a {story_type} that {story_objective}.

Story Parameters:
- Genre: {genre}
- Target audience: {audience}
- Tone: {tone}
- Length: {length}
- Key themes: {themes}

Please develop this story using advanced narrative techniques:

1. STORY STRUCTURE
   - Compelling hook and opening
   - Well-paced plot development
   - Clear character arcs
   - Satisfying resolution

2. CHARACTER DEVELOPMENT
   - Multi-dimensional characters with clear motivations
   - Authentic dialogue and voice
   - Character growth throughout the narrative

3. NARRATIVE TECHNIQUES
   - Appropriate point of view
   - Effective use of conflict and tension
   - Sensory details and vivid descriptions
   - Show vs. tell balance

4. THEMATIC DEPTH
   - Meaningful themes woven throughout
   - Symbolic elements and metaphors
   - Emotional resonance with audience`,
      variables: ['story_type', 'story_objective', 'genre', 'audience', 'tone', 'length', 'themes'],
      effectiveness: 85,
      applicableIntents: ['creative', 'instructional']
    },

    // Academic Domain Patterns
    {
      id: 'academic_research_analysis',
      domain: 'academic',
      name: 'Scholarly Research Framework',
      description: 'For academic research and analysis',
      template: `As a distinguished researcher and academic scholar, conduct a comprehensive analysis of {research_topic} within the context of {academic_field}.

Research Parameters:
- Research question: {research_question}
- Scope: {scope}
- Methodology preference: {methodology}
- Academic level: {level}

Please structure your analysis using rigorous academic standards:

1. LITERATURE REVIEW
   - Current state of research in the field
   - Key theories and frameworks
   - Identified gaps and controversies
   - Methodological considerations

2. THEORETICAL FRAMEWORK
   - Relevant theoretical perspectives
   - Conceptual model development
   - Hypothesis formation (if applicable)

3. METHODOLOGY
   - Appropriate research design
   - Data collection strategies
   - Analysis techniques
   - Limitations and ethical considerations

4. IMPLICATIONS
   - Theoretical contributions
   - Practical applications
   - Future research directions
   - Policy implications (if relevant)

Please ensure all recommendations are grounded in peer-reviewed literature and follow academic writing conventions.`,
      variables: ['research_topic', 'academic_field', 'research_question', 'scope', 'methodology', 'level'],
      effectiveness: 89,
      applicableIntents: ['analytical', 'instructional', 'problem_solving']
    }
  ];

  private static domainRules: DomainOptimizationRule[] = [
    {
      domain: 'technology',
      triggers: ['code', 'software', 'architecture', 'programming', 'algorithm', 'database', 'api'],
      optimizations: {
        structure: ['technical_specification', 'implementation_steps', 'testing_approach'],
        terminology: ['technical_precision', 'industry_standards', 'best_practices'],
        contextAdditions: ['technology_stack', 'scalability_requirements', 'security_considerations'],
        constraints: ['performance_requirements', 'compatibility_constraints', 'resource_limitations']
      }
    },
    {
      domain: 'business',
      triggers: ['strategy', 'market', 'revenue', 'customer', 'growth', 'competitive', 'roi'],
      optimizations: {
        structure: ['executive_summary', 'market_analysis', 'financial_projections', 'implementation_plan'],
        terminology: ['business_metrics', 'strategic_frameworks', 'market_terminology'],
        contextAdditions: ['market_context', 'competitive_landscape', 'stakeholder_impact'],
        constraints: ['budget_limitations', 'timeline_constraints', 'regulatory_requirements']
      }
    },
    {
      domain: 'creative',
      triggers: ['story', 'creative', 'design', 'artistic', 'narrative', 'visual', 'content'],
      optimizations: {
        structure: ['creative_brief', 'concept_development', 'execution_details', 'iteration_process'],
        terminology: ['creative_concepts', 'artistic_techniques', 'design_principles'],
        contextAdditions: ['target_audience', 'brand_guidelines', 'creative_objectives'],
        constraints: ['style_requirements', 'content_guidelines', 'format_specifications']
      }
    },
    {
      domain: 'academic',
      triggers: ['research', 'analysis', 'study', 'academic', 'scholarly', 'peer-review', 'methodology'],
      optimizations: {
        structure: ['literature_review', 'methodology', 'analysis', 'conclusions', 'references'],
        terminology: ['academic_rigor', 'scholarly_language', 'research_terminology'],
        contextAdditions: ['theoretical_framework', 'research_context', 'academic_standards'],
        constraints: ['peer_review_standards', 'citation_requirements', 'academic_integrity']
      }
    }
  ];

  // Apply domain-specific optimization to a prompt
  static optimizeForDomain(prompt: string, domain: string, intent: string): string {
    const domainRule = this.domainRules.find(rule => rule.domain === domain);
    if (!domainRule) return prompt;

    // Check if prompt contains domain triggers
    const lowerPrompt = prompt.toLowerCase();
    const hasRelevantTriggers = domainRule.triggers.some(trigger => lowerPrompt.includes(trigger));
    
    if (!hasRelevantTriggers) return prompt;

    // Find applicable patterns
    const applicablePatterns = this.domainPatterns.filter(pattern => 
      pattern.domain === domain && 
      pattern.applicableIntents.includes(intent)
    );

    if (applicablePatterns.length === 0) {
      return this.applyGenericDomainOptimization(prompt, domainRule);
    }

    // Use the most effective applicable pattern
    const bestPattern = applicablePatterns.reduce((best, current) => 
      current.effectiveness > best.effectiveness ? current : best
    );

    return this.applyPatternOptimization(prompt, bestPattern, domainRule);
  }

  // Get domain-specific suggestions
  static getDomainSuggestions(prompt: string, domain: string): string[] {
    const suggestions = [];
    const domainRule = this.domainRules.find(rule => rule.domain === domain);
    
    if (!domainRule) return suggestions;

    const lowerPrompt = prompt.toLowerCase();

    // Structure suggestions
    if (!lowerPrompt.includes('step') && !lowerPrompt.includes('process')) {
      suggestions.push(`Add structured approach with clear steps for ${domain} context`);
    }

    // Terminology suggestions
    if (domain === 'technology' && !this.hasCodeSpecificTerms(prompt)) {
      suggestions.push('Include technical specifications and implementation details');
    }

    if (domain === 'business' && !this.hasBusinessMetrics(prompt)) {
      suggestions.push('Add business metrics, KPIs, and success criteria');
    }

    if (domain === 'academic' && !this.hasAcademicStructure(prompt)) {
      suggestions.push('Structure with academic rigor including methodology and citations');
    }

    // Context suggestions
    if (!lowerPrompt.includes('context') && !lowerPrompt.includes('background')) {
      suggestions.push(`Provide relevant ${domain} context and background information`);
    }

    return suggestions;
  }

  // Get available patterns for a domain
  static getPatternsForDomain(domain: string): DomainPattern[] {
    return this.domainPatterns.filter(pattern => pattern.domain === domain);
  }

  // Apply a specific pattern to a prompt
  static applyPattern(prompt: string, patternId: string, variables: Record<string, string>): string {
    const pattern = this.domainPatterns.find(p => p.id === patternId);
    if (!pattern) return prompt;

    let optimizedPrompt = pattern.template;

    // Replace variables in template
    pattern.variables.forEach(variable => {
      const value = variables[variable] || `[${variable}]`;
      optimizedPrompt = optimizedPrompt.replace(new RegExp(`{${variable}}`, 'g'), value);
    });

    // Integrate original prompt if not fully covered by pattern
    if (!variables['user_prompt'] && !optimizedPrompt.includes(prompt)) {
      optimizedPrompt = optimizedPrompt.replace('{user_prompt}', prompt);
    }

    return optimizedPrompt;
  }

  // Private helper methods
  private static applyGenericDomainOptimization(prompt: string, domainRule: DomainOptimizationRule): string {
    let optimizedPrompt = prompt;

    // Add domain-specific context
    const contextAdditions = domainRule.optimizations.contextAdditions.slice(0, 2);
    if (contextAdditions.length > 0) {
      optimizedPrompt = `${optimizedPrompt}\n\nPlease consider the following ${domainRule.domain} context:\n- ${contextAdditions.join('\n- ')}`;
    }

    // Add structure suggestions
    const structureElements = domainRule.optimizations.structure.slice(0, 3);
    if (structureElements.length > 0) {
      optimizedPrompt = `${optimizedPrompt}\n\nStructure your response to include:\n- ${structureElements.join('\n- ')}`;
    }

    return optimizedPrompt;
  }

  private static applyPatternOptimization(prompt: string, pattern: DomainPattern, domainRule: DomainOptimizationRule): string {
    // Extract potential variables from the original prompt
    const variables = this.extractVariablesFromPrompt(prompt, pattern.variables);
    
    // Apply pattern with extracted variables
    let optimizedPrompt = this.applyPattern(prompt, pattern.id, variables);

    // Add any missing domain-specific optimizations
    const missingOptimizations = this.identifyMissingOptimizations(optimizedPrompt, domainRule);
    if (missingOptimizations.length > 0) {
      optimizedPrompt = `${optimizedPrompt}\n\nAdditional considerations:\n- ${missingOptimizations.join('\n- ')}`;
    }

    return optimizedPrompt;
  }

  private static extractVariablesFromPrompt(prompt: string, variables: string[]): Record<string, string> {
    const extracted: Record<string, string> = {};
    
    // Simple extraction based on common patterns
    variables.forEach(variable => {
      switch (variable) {
        case 'objective':
        case 'purpose':
          const objectiveMatch = prompt.match(/(?:to|for|objective|purpose|goal)[\s:]+(.*?)(?:\.|$|,)/i);
          if (objectiveMatch) extracted[variable] = objectiveMatch[1].trim();
          break;
        case 'requirements':
          const reqMatch = prompt.match(/(?:requirements?|needs?|must|should)[\s:]+(.*?)(?:\.|$)/i);
          if (reqMatch) extracted[variable] = reqMatch[1].trim();
          break;
        default:
          // Generic extraction
          const genericMatch = prompt.match(new RegExp(`(?:${variable})[\s:]+(.*?)(?:\\.|$|,)`, 'i'));
          if (genericMatch) extracted[variable] = genericMatch[1].trim();
      }
    });

    return extracted;
  }

  private static identifyMissingOptimizations(prompt: string, domainRule: DomainOptimizationRule): string[] {
    const missing = [];
    const lowerPrompt = prompt.toLowerCase();

    // Check for missing structure elements
    if (!lowerPrompt.includes('implementation') && domainRule.optimizations.structure.includes('implementation_steps')) {
      missing.push('Include implementation steps and timeline');
    }

    // Check for missing constraints
    if (!lowerPrompt.includes('constraint') && !lowerPrompt.includes('limitation')) {
      missing.push('Consider relevant constraints and limitations');
    }

    return missing;
  }

  private static hasCodeSpecificTerms(prompt: string): boolean {
    const codeTerms = ['function', 'class', 'method', 'variable', 'algorithm', 'data structure', 'api', 'framework'];
    return codeTerms.some(term => prompt.toLowerCase().includes(term));
  }

  private static hasBusinessMetrics(prompt: string): boolean {
    const businessTerms = ['roi', 'kpi', 'metric', 'revenue', 'profit', 'cost', 'budget', 'target'];
    return businessTerms.some(term => prompt.toLowerCase().includes(term));
  }

  private static hasAcademicStructure(prompt: string): boolean {
    const academicTerms = ['research', 'methodology', 'literature', 'analysis', 'conclusion', 'reference'];
    return academicTerms.some(term => prompt.toLowerCase().includes(term));
  }
}