
export interface DomainPattern {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  domain: string;
  effectiveness: number;
  examples: string[];
}

export interface DomainVariable {
  name: string;
  description: string;
  examples: string[];
  required: boolean;
}

// Collection of domain-specific prompt patterns
export const domainPatterns: DomainPattern[] = [
  // Technical Domain Patterns
  {
    id: "technical_explainer",
    name: "Technical Explainer",
    description: "Explain a technical concept clearly to a specific audience",
    template: "Explain {{concept}} to {{audience}} in {{complexity}} terms. Focus on {{aspectsToHighlight}} and use {{analogyType}} analogies for clarity. Include {{exampleType}} examples.",
    variables: ["concept", "audience", "complexity", "aspectsToHighlight", "analogyType", "exampleType"],
    domain: "technical",
    effectiveness: 85,
    examples: [
      "Explain Docker containerization to junior developers in intermediate terms. Focus on practical implementation and use real-world analogies for clarity. Include code examples.",
      "Explain quantum computing to college students in accessible terms. Focus on fundamental principles and use everyday analogies for clarity. Include visual examples."
    ]
  },
  {
    id: "code_generation",
    name: "Code Generation",
    description: "Generate high-quality code with specific requirements",
    template: "Write a {{language}} function/program to {{taskDescription}}. It should handle {{edgeCases}}. Optimize for {{optimizationGoals}}. Include {{documentationLevel}} documentation and {{testingApproach}} tests.",
    variables: ["language", "taskDescription", "edgeCases", "optimizationGoals", "documentationLevel", "testingApproach"],
    domain: "programming",
    effectiveness: 90,
    examples: [
      "Write a Python function to parse CSV files with nested JSON fields. It should handle missing fields and malformed JSON. Optimize for memory efficiency. Include comprehensive documentation and unit tests.",
      "Write a TypeScript React component to display a paginated data table. It should handle loading states and error cases. Optimize for accessibility and performance. Include JSDoc documentation and integration tests."
    ]
  },
  
  // Business Domain Patterns
  {
    id: "business_analysis",
    name: "Business Analysis",
    description: "Analyze business data or scenarios with structured output",
    template: "Analyze the {{businessScenario}} considering {{factorsToConsider}}. Identify key {{insightType}} insights. Evaluate potential {{riskType}} risks and provide {{recommendationType}} recommendations based on {{industryStandard}} standards.",
    variables: ["businessScenario", "factorsToConsider", "insightType", "riskType", "recommendationType", "industryStandard"],
    domain: "business",
    effectiveness: 82,
    examples: [
      "Analyze the declining user engagement metrics considering seasonal trends and competitive landscape. Identify key actionable insights. Evaluate potential revenue risks and provide strategic recommendations based on SaaS industry standards.",
      "Analyze the supply chain disruption considering global factors and internal processes. Identify key efficiency insights. Evaluate potential operational risks and provide cost-cutting recommendations based on manufacturing industry standards."
    ]
  },
  {
    id: "marketing_content",
    name: "Marketing Content Generator",
    description: "Generate effective marketing content for specific audiences",
    template: "Create {{contentType}} marketing content for {{productOrService}} targeting {{targetAudience}}. Highlight {{valuePropositions}} and address {{painPoints}}. Use a {{toneName}} tone and include {{callToAction}} CTA. Length: {{contentLength}}.",
    variables: ["contentType", "productOrService", "targetAudience", "valuePropositions", "painPoints", "toneName", "callToAction", "contentLength"],
    domain: "marketing",
    effectiveness: 88,
    examples: [
      "Create email newsletter marketing content for a premium fitness app targeting busy professionals aged 30-45. Highlight time-efficiency and personalization and address concerns about commitment and results. Use a motivational tone and include 'Start your free trial' CTA. Length: 300-400 words.",
      "Create social media post marketing content for a sustainable clothing brand targeting environmentally conscious millennials. Highlight eco-friendly materials and ethical manufacturing and address concerns about price and durability. Use an authentic tone and include 'Shop the collection' CTA. Length: 100-150 words."
    ]
  },
  
  // Creative Domain Patterns
  {
    id: "creative_writing",
    name: "Creative Writing",
    description: "Generate creative writing with specific elements and style",
    template: "Write a {{genre}} {{contentType}} about {{subject}}. Include themes of {{themes}} and set in {{setting}}. The {{characterType}} character should face {{conflictType}} conflict. Use {{styleName}} style with {{toneDescription}} tone.",
    variables: ["genre", "contentType", "subject", "themes", "setting", "characterType", "conflictType", "styleName", "toneDescription"],
    domain: "creative",
    effectiveness: 84,
    examples: [
      "Write a science fiction short story about first contact with an alien civilization. Include themes of communication barriers and shared humanity and set in deep space. The linguist protagonist character should face internal and ethical conflict. Use descriptive style with contemplative tone.",
      "Write a mystery flash fiction about a missing heirloom. Include themes of family secrets and redemption and set in a Victorian mansion. The elderly detective character should face intellectual conflict. Use concise style with suspenseful tone."
    ]
  },
  {
    id: "design_brief",
    name: "Design Brief",
    description: "Create comprehensive design briefs for various projects",
    template: "Create a design brief for a {{projectType}} project for {{clientType}}. The project goals are {{projectGoals}}. Target audience is {{targetAudience}} with preferences for {{audiencePreferences}}. Include {{brandingElements}} branding elements, {{styleGuidelines}} style guidelines, and {{deliverables}} deliverables.",
    variables: ["projectType", "clientType", "projectGoals", "targetAudience", "audiencePreferences", "brandingElements", "styleGuidelines", "deliverables"],
    domain: "design",
    effectiveness: 86,
    examples: [
      "Create a design brief for a website redesign project for a boutique hotel chain. The project goals are to increase direct bookings and showcase property amenities. Target audience is luxury travelers aged 35-60 with preferences for minimalist aesthetics and seamless experiences. Include sophisticated color palette and typography branding elements, elegant and intuitive style guidelines, and desktop/mobile mockups and interactive prototype deliverables.",
      "Create a design brief for a brand identity project for a tech startup in the sustainability sector. The project goals are to establish market presence and communicate innovation with environmental responsibility. Target audience is environmentally conscious businesses with preferences for clean design and meaningful visual storytelling. Include logo system and visual language branding elements, eco-friendly and forward-looking style guidelines, and logo variations, brand guidelines and stationery design deliverables."
    ]
  },
  
  // Educational Domain Patterns
  {
    id: "lesson_plan",
    name: "Lesson Plan Generator",
    description: "Create effective lesson plans for educators",
    template: "Create a {{duration}} lesson plan on {{subject}} for {{gradeLevel}} students. Learning objectives: {{learningObjectives}}. Include {{activityTypes}} activities, {{resourceTypes}} resources, and {{assessmentMethods}} assessment methods. Address {{challengesToAddress}} potential challenges.",
    variables: ["duration", "subject", "gradeLevel", "learningObjectives", "activityTypes", "resourceTypes", "assessmentMethods", "challengesToAddress"],
    domain: "education",
    effectiveness: 89,
    examples: [
      "Create a 60-minute lesson plan on photosynthesis for 7th grade students. Learning objectives: explain the process of photosynthesis and identify its importance in ecosystems. Include hands-on experiment and group discussion activities, visual diagrams and online simulation resources, and lab worksheet and exit ticket assessment methods. Address varying science background knowledge and maintaining engagement potential challenges.",
      "Create a 90-minute lesson plan on persuasive writing for 10th grade students. Learning objectives: identify persuasive techniques and craft effective arguments with supporting evidence. Include rhetorical analysis and peer review workshop activities, example texts and outlining templates resources, and writing rubric and peer feedback assessment methods. Address varying writing proficiency and time management potential challenges."
    ]
  },
  
  // Scientific Domain Patterns
  {
    id: "research_question",
    name: "Research Question Formulator",
    description: "Formulate precise and effective research questions",
    template: "Formulate {{questionCount}} research questions to investigate the relationship between {{variableX}} and {{variableY}} in the context of {{researchContext}}. Questions should be {{questionType}} and consider {{methodologicalApproach}} methodological approach with {{constraintsToConsider}} constraints.",
    variables: ["questionCount", "variableX", "variableY", "researchContext", "questionType", "methodologicalApproach", "constraintsToConsider"],
    domain: "scientific",
    effectiveness: 87,
    examples: [
      "Formulate 3 research questions to investigate the relationship between social media usage and mental health outcomes in the context of adolescent development. Questions should be causal and consider longitudinal methodological approach with ethical data collection and control group constraints.",
      "Formulate 2 research questions to investigate the relationship between dietary patterns and cognitive performance in the context of aging adults. Questions should be correlational and consider mixed-methods methodological approach with sample diversity and confounding variables constraints."
    ]
  },
];

// Domain-specific variables and their descriptions
export const domainVariables: Record<string, DomainVariable[]> = {
  "technical": [
    {
      name: "concept",
      description: "The technical concept to be explained",
      examples: ["containerization", "cloud computing", "neural networks"],
      required: true
    },
    {
      name: "audience",
      description: "The target audience for the explanation",
      examples: ["beginners", "senior developers", "business stakeholders"],
      required: true
    },
    {
      name: "complexity",
      description: "The complexity level of the explanation",
      examples: ["basic", "intermediate", "advanced"],
      required: true
    },
    {
      name: "aspectsToHighlight",
      description: "Specific aspects of the concept to focus on",
      examples: ["practical applications", "underlying principles", "cost considerations"],
      required: true
    },
    {
      name: "analogyType",
      description: "Type of analogies to use for better understanding",
      examples: ["real-world", "everyday", "familiar concept"],
      required: true
    },
    {
      name: "exampleType",
      description: "Type of examples to include in the explanation",
      examples: ["code", "visual", "case study"],
      required: false
    }
  ],
  // Add similar variable definitions for other domains
};

export class DomainPatternService {
  /**
   * Get all patterns for a specific domain
   */
  static getPatternsForDomain(domain: string): DomainPattern[] {
    return domainPatterns.filter(pattern => pattern.domain === domain);
  }
  
  /**
   * Get a specific pattern by ID
   */
  static getPatternById(id: string): DomainPattern | undefined {
    return domainPatterns.find(pattern => pattern.id === id);
  }
  
  /**
   * Apply a specific pattern to a prompt
   */
  static applyPattern(prompt: string, patternId: string, variables: Record<string, string>): string {
    const pattern = this.getPatternById(patternId);
    if (!pattern) return prompt;
    
    let result = pattern.template;
    
    // Replace variables in the template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, value);
    }
    
    // For any remaining placeholders, use the original prompt
    if (result.includes('{{')) {
      result = prompt;
    }
    
    return result;
  }
  
  /**
   * Get domain-specific suggestions for prompt improvement
   */
  static getSuggestionsForDomain(domain: string): string[] {
    switch (domain) {
      case "programming":
        return [
          "Specify the programming language and version",
          "Include expected input/output formats",
          "Mention performance constraints",
          "Ask for code comments or documentation"
        ];
      case "business":
        return [
          "Define specific metrics for analysis",
          "Specify the industry or market context",
          "Ask for actionable recommendations",
          "Request data visualization formats"
        ];
      case "creative":
        return [
          "Specify tone, style and audience",
          "Provide examples of content you like",
          "Include content length guidelines",
          "Mention specific themes or elements to include"
        ];
      case "education":
        return [
          "Specify the educational level",
          "Mention learning objectives",
          "Include time constraints",
          "Request specific teaching approaches"
        ];
      default:
        return [
          "Be more specific about your objectives",
          "Provide context for your request",
          "Include constraints or requirements",
          "Specify your audience or target"
        ];
    }
  }
  
  /**
   * Detect the most likely domain for a prompt
   */
  static detectDomain(prompt: string): string {
    const domains = {
      "programming": /(code|function|program|algorithm|software|developer|javascript|python|java|typescript|api)/i,
      "business": /(business|marketing|sales|strategy|report|analysis|metrics|revenue|customer|market|ROI)/i,
      "creative": /(write|story|article|creative|design|blog|content|novel|poem|script)/i,
      "education": /(teach|learn|student|lesson|education|course|curriculum|academic)/i,
      "scientific": /(research|experiment|study|hypothesis|data|analysis|scientific|evidence)/i,
      "technical": /(technical|technology|system|architecture|infrastructure|framework|platform)/i
    };
    
    for (const [domain, pattern] of Object.entries(domains)) {
      if (pattern.test(prompt)) {
        return domain;
      }
    }
    
    return "general";
  }
}
