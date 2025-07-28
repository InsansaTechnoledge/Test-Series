export const analysisUtils = {
    /**
     * Analyze questions to extract subjects, difficulties, and bloom levels
     */
    analyzeQuestions(questions) {
      if (!questions || !Array.isArray(questions)) {
        return { subjects: {}, difficulties: [], bloomTexts: [] };
      }
      
      const subjects = {};
      const difficulties = new Set();
      const bloomTexts = new Set();
      
      questions.forEach(q => {
        // Analyze subjects
        const subject = q.subject?.trim();
        if (subject) {
          subjects[subject] = (subjects[subject] || 0) + 1;
        }
        
        // Analyze difficulties
        if (q.difficulty) {
          const normalizedDifficulty = this.normalizeDifficulty(q.difficulty);
          if (normalizedDifficulty) {
            difficulties.add(normalizedDifficulty);
          }
        }
        
        // Analyze bloom levels
        if (q.bloom_level) {
          const normalizedBloom = this.normalizeBloomLevel(q.bloom_level);
          if (normalizedBloom) {
            bloomTexts.add(normalizedBloom);
          }
        }
      });
      
      return {
        subjects,
        difficulties: Array.from(difficulties).sort(),
        bloomTexts: Array.from(bloomTexts).sort()
      };
    },
  
    /**
     * Normalize difficulty levels to standard format
     */
    normalizeDifficulty(difficulty) {
      if (!difficulty) return null;
      
      const normalized = difficulty.toLowerCase().trim();
      
      const difficultyMap = {
        'easy': 'easy',
        'simple': 'easy',
        'basic': 'easy',
        'low': 'easy',
        'beginner': 'easy',
        'elementary': 'easy',
        'medium': 'medium',
        'moderate': 'medium',
        'intermediate': 'medium',
        'average': 'medium',
        'middle': 'medium',
        'hard': 'hard',
        'difficult': 'hard',
        'complex': 'hard',
        'high': 'hard',
        'advanced': 'hard',
        'challenging': 'hard',
        'expert': 'hard'
      };
  
      return difficultyMap[normalized] || null;
    },
  
    /**
     * Normalize Bloom taxonomy levels to standard format
     */
    normalizeBloomLevel(bloomLevel) {
      if (!bloomLevel) return null;
  
      const normalized = bloomLevel.toLowerCase().trim();
      
      const bloomMap = {
        // Remember level
        'remember': 'remember',
        'recall': 'remember',
        'recognize': 'remember',
        'knowledge': 'remember',
        'memorize': 'remember',
        'list': 'remember',
        'define': 'remember',
        'identify': 'remember',
        
        // Understand level
        'understand': 'understand',
        'comprehend': 'understand',
        'explain': 'understand',
        'comprehension': 'understand',
        'describe': 'understand',
        'summarize': 'understand',
        'interpret': 'understand',
        'classify': 'understand',
        
        // Apply level
        'apply': 'apply',
        'use': 'apply',
        'implement': 'apply',
        'application': 'apply',
        'execute': 'apply',
        'solve': 'apply',
        'demonstrate': 'apply',
        'operate': 'apply',
        
        // Analyze level
        'analyze': 'analyze',
        'analyse': 'analyze',  // British spelling
        'examine': 'analyze',
        'compare': 'analyze',
        'analysis': 'analyze',
        'contrast': 'analyze',
        'differentiate': 'analyze',
        'organize': 'analyze',
        'deconstruct': 'analyze',
        
        // Evaluate level
        'evaluate': 'evaluate',
        'assess': 'evaluate',
        'judge': 'evaluate',
        'evaluation': 'evaluate',
        'critique': 'evaluate',
        'appraise': 'evaluate',
        'defend': 'evaluate',
        'justify': 'evaluate',
        
        // Create level
        'create': 'create',
        'design': 'create',
        'compose': 'create',
        'synthesis': 'create',
        'synthesize': 'create',
        'construct': 'create',
        'generate': 'create',
        'produce': 'create',
        'plan': 'create'
      };
  
      return bloomMap[normalized] || null;
    },
  
    /**
     * Get statistics about question distribution
     */
    getDistributionStats(questions) {
      const stats = {
        bySubject: {},
        byDifficulty: { easy: 0, medium: 0, hard: 0 },
        byBloom: { 
          remember: 0, 
          understand: 0, 
          apply: 0, 
          analyze: 0, 
          evaluate: 0, 
          create: 0 
        },
        total: questions.length
      };
  
      questions.forEach(q => {
        // Subject stats
        const subject = q.subject?.trim();
        if (subject) {
          if (!stats.bySubject[subject]) {
            stats.bySubject[subject] = { count: 0, questions: [] };
          }
          stats.bySubject[subject].count++;
          stats.bySubject[subject].questions.push(q);
        }
  
        // Difficulty stats
        const difficulty = this.normalizeDifficulty(q.difficulty);
        if (difficulty && stats.byDifficulty[difficulty] !== undefined) {
          stats.byDifficulty[difficulty]++;
        }
  
        // Bloom stats
        const bloom = this.normalizeBloomLevel(q.bloom_level);
        if (bloom && stats.byBloom[bloom] !== undefined) {
          stats.byBloom[bloom]++;
        }
      });
  
      return stats;
    },
  
    /**
     * Validate question data quality
     */
    validateQuestions(questions) {
      const validation = {
        total: questions.length,
        valid: 0,
        issues: {
          missingSubject: 0,
          missingDifficulty: 0,
          missingBloom: 0,
          missingQuestionText: 0,
          missingOptions: 0
        }
      };
  
      questions.forEach(q => {
        let isValid = true;
  
        // Check for missing fields
        if (!q.subject || !q.subject.trim()) {
          validation.issues.missingSubject++;
          isValid = false;
        }
  
        if (!q.difficulty) {
          validation.issues.missingDifficulty++;
          isValid = false;
        }
  
        if (!q.bloom_level) {
          validation.issues.missingBloom++;
          isValid = false;
        }
  
        if (!q.question_text && !q.title) {
          validation.issues.missingQuestionText++;
          isValid = false;
        }
  
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
          validation.issues.missingOptions++;
          isValid = false;
        }
  
        if (isValid) {
          validation.valid++;
        }
      });
  
      validation.validPercentage = Math.round((validation.valid / validation.total) * 100);
  
      return validation;
    }
  };