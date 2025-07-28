export const examGenerationAlgorithm = {
    /**
     * Main function to generate exam paper based on marks and percentage distributions
     */
    generateExam({ questions, config }) {
      console.log('Starting exam generation with config:', config);
      console.log('Total questions available:', questions.length);
  
      const {
        paperTitle,
        totalMarks,
        timeLimit,
        subjects,
        difficultyDistribution,
        bloomDistribution,
        marksPerQuestion
      } = config;
  
      // Step 1: Calculate target distribution based on marks
      const targetDistribution = this.calculateTargetDistribution(
        totalMarks,
        subjects,
        difficultyDistribution,
        bloomDistribution,
        marksPerQuestion
      );
  
      console.log('Target distribution calculated:', targetDistribution);
  
      // Step 2: Categorize questions by subject, difficulty, and bloom level
      const categorizedQuestions = this.categorizeQuestions(questions);
      
      console.log('Questions categorized:', Object.keys(categorizedQuestions));
  
      // Step 3: Select questions based on target distribution
      const selectedQuestions = this.selectQuestions(
        categorizedQuestions,
        targetDistribution,
        marksPerQuestion
      );
  
      console.log('Selected questions count:', selectedQuestions.length);
  
      // Step 4: Shuffle and finalize paper
      const finalQuestions = this.shuffleQuestions(selectedQuestions);
  
      // Step 5: Calculate actual statistics
      const actualStats = this.calculateActualStats(finalQuestions, marksPerQuestion);
  
      // Step 6: Create comprehensive paper structure
      const paper = {
        id: `paper_${Date.now()}`,
        title: paperTitle || `Auto Generated Paper - ${new Date().toLocaleDateString()}`,
        timeLimit,
        totalMarks: actualStats.totalMarks,
        totalQuestions: finalQuestions.length,
        subjects,
        targetDistribution,
        actualDistribution: actualStats,
        questions: finalQuestions,
        generatedAt: new Date().toISOString(),
        instructions: this.generateInstructions(actualStats, timeLimit),
        // Additional breakdown for UI components
        subjectWiseBreakdown: this.createSubjectBreakdown(finalQuestions, marksPerQuestion),
        difficultyBreakdown: actualStats.difficulty,
        bloomBreakdown: actualStats.bloom
      };
  
      console.log('Final paper generated:', {
        totalQuestions: paper.totalQuestions,
        totalMarks: paper.totalMarks,
        subjects: Object.keys(paper.subjectWiseBreakdown)
      });
  
      return paper;
    },
  
    /**
     * Calculate target distribution based on marks and percentages
     */
    calculateTargetDistribution(totalMarks, subjects, difficultyDist, bloomDist, marksPerQuestion) {
      const distribution = {};
  
      Object.entries(subjects).forEach(([subject, subjectMarks]) => {
        if (subjectMarks <= 0) return;
  
        distribution[subject] = {
          totalMarks: subjectMarks,
          difficulty: {
            easy: {
              marks: Math.round((subjectMarks * difficultyDist.easy) / 100),
              questions: 0
            },
            medium: {
              marks: Math.round((subjectMarks * difficultyDist.medium) / 100),
              questions: 0
            },
            hard: {
              marks: Math.round((subjectMarks * difficultyDist.hard) / 100),
              questions: 0
            }
          },
          bloom: {
            remember: Math.round((subjectMarks * bloomDist.remember) / 100),
            understand: Math.round((subjectMarks * bloomDist.understand) / 100),
            apply: Math.round((subjectMarks * bloomDist.apply) / 100),
            analyze: Math.round((subjectMarks * bloomDist.analyze) / 100),
            evaluate: Math.round((subjectMarks * bloomDist.evaluate) / 100),
            create: Math.round((subjectMarks * bloomDist.create) / 100)
          }
        };
  
        // Calculate number of questions needed for each difficulty
        Object.keys(distribution[subject].difficulty).forEach(diff => {
          const marks = distribution[subject].difficulty[diff].marks;
          if (marks > 0) {
            distribution[subject].difficulty[diff].questions = 
              Math.max(1, Math.ceil(marks / marksPerQuestion[diff]));
          }
        });
  
        // Adjust marks to match actual questions * marks per question
        Object.keys(distribution[subject].difficulty).forEach(diff => {
          const questions = distribution[subject].difficulty[diff].questions;
          distribution[subject].difficulty[diff].marks = 
            questions * marksPerQuestion[diff];
        });
      });
  
      return distribution;
    },
  
    /**
     * Categorize questions by subject, difficulty, and bloom level
     */
    categorizeQuestions(questions) {
      const categorized = {};
  
      questions.forEach(question => {
        const subject = question.subject?.trim();
        const difficulty = this.normalizeDifficulty(question.difficulty);
        const bloom = this.normalizeBloomLevel(question.bloom_level);
  
        // More flexible subject matching
        if (!subject) {
          console.warn('Question missing subject:', question);
          return;
        }
  
        if (!difficulty) {
          console.warn('Question missing/invalid difficulty:', question);
          return;
        }
  
        if (!bloom) {
          console.warn('Question missing/invalid bloom level:', question);
          return;
        }
  
        if (!categorized[subject]) {
          categorized[subject] = {};
        }
  
        if (!categorized[subject][difficulty]) {
          categorized[subject][difficulty] = {};
        }
  
        if (!categorized[subject][difficulty][bloom]) {
          categorized[subject][difficulty][bloom] = [];
        }
  
        categorized[subject][difficulty][bloom].push({
          ...question,
          normalizedDifficulty: difficulty,
          normalizedBloom: bloom
        });
      });
  
      // Log categorization results
      Object.entries(categorized).forEach(([subject, subjectData]) => {
        console.log(`Subject: ${subject}`);
        Object.entries(subjectData).forEach(([diff, diffData]) => {
          Object.entries(diffData).forEach(([bloom, questions]) => {
            console.log(`  ${diff}-${bloom}: ${questions.length} questions`);
          });
        });
      });
  
      return categorized;
    },
  
    /**
     * Select questions based on target distribution using advanced algorithm
     */
    selectQuestions(categorizedQuestions, targetDistribution, marksPerQuestion) {
      const selectedQuestions = [];
      const usedQuestions = new Set();
  
      Object.entries(targetDistribution).forEach(([subject, subjectTarget]) => {
        console.log(`Processing subject: ${subject}`);
        
        if (!categorizedQuestions[subject]) {
          console.warn(`No questions found for subject: ${subject}`);
          return;
        }
  
        // First pass: Select questions for each difficulty level
        Object.entries(subjectTarget.difficulty).forEach(([difficulty, diffTarget]) => {
          console.log(`  Processing difficulty: ${difficulty}, target questions: ${diffTarget.questions}`);
          
          if (diffTarget.questions <= 0) return;
  
          const availableQuestions = this.getAvailableQuestions(
            categorizedQuestions[subject][difficulty],
            usedQuestions
          );
  
          console.log(`  Available questions for ${difficulty}:`, Object.keys(availableQuestions).length);
  
          // Select questions with bloom level distribution preference
          const selectedForDifficulty = this.selectQuestionsWithBloomPreference(
            availableQuestions,
            diffTarget.questions,
            subjectTarget.bloom,
            marksPerQuestion[difficulty],
            usedQuestions
          );
  
          console.log(`  Selected ${selectedForDifficulty.length} questions for ${subject}-${difficulty}`);
          selectedQuestions.push(...selectedForDifficulty);
        });
      });
  
      console.log(`Total selected questions: ${selectedQuestions.length}`);
      return selectedQuestions;
    },
  
    /**
     * Select questions with Bloom taxonomy preference
     */
    selectQuestionsWithBloomPreference(availableQuestions, targetCount, bloomTarget, marksPerQuestion, usedQuestions) {
      const selected = [];
      const bloomLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
  
      // Calculate how many questions we need for each bloom level (approximation)
      const bloomCounts = {};
      const totalBloomMarks = Object.values(bloomTarget).reduce((sum, marks) => sum + marks, 0);
      
      if (totalBloomMarks > 0) {
        bloomLevels.forEach(level => {
          bloomCounts[level] = Math.round((bloomTarget[level] / totalBloomMarks) * targetCount);
        });
      } else {
        // If no bloom distribution, distribute equally
        const perLevel = Math.floor(targetCount / bloomLevels.length);
        bloomLevels.forEach(level => {
          bloomCounts[level] = perLevel;
        });
      }
  
      console.log(`    Bloom distribution target:`, bloomCounts);
  
      // Try to select questions for each bloom level
      bloomLevels.forEach(bloomLevel => {
        const needed = bloomCounts[bloomLevel];
        if (needed <= 0 || !availableQuestions[bloomLevel]) return;
  
        const questions = availableQuestions[bloomLevel].filter(q => !usedQuestions.has(q.id));
        if (questions.length === 0) return;
  
        const shuffled = this.shuffleArray([...questions]);
        
        const toSelect = Math.min(needed, shuffled.length);
        console.log(`    Selecting ${toSelect} questions for bloom level: ${bloomLevel}`);
        
        for (let i = 0; i < toSelect; i++) {
          selected.push({
            ...shuffled[i],
            marks: marksPerQuestion,
            bloomLevel,
            difficultyLevel: shuffled[i].normalizedDifficulty
          });
          usedQuestions.add(shuffled[i].id);
        }
      });
  
      // Fill remaining slots with any available questions
      const remaining = targetCount - selected.length;
      if (remaining > 0) {
        console.log(`    Filling ${remaining} remaining slots with any available questions`);
        
        const allAvailable = [];
        Object.values(availableQuestions).forEach(bloomQuestions => {
          if (Array.isArray(bloomQuestions)) {
            allAvailable.push(...bloomQuestions.filter(q => !usedQuestions.has(q.id)));
          }
        });
  
        const shuffled = this.shuffleArray(allAvailable);
        const toSelect = Math.min(remaining, shuffled.length);
        
        for (let i = 0; i < toSelect; i++) {
          selected.push({
            ...shuffled[i],
            marks: marksPerQuestion,
            bloomLevel: shuffled[i].normalizedBloom,
            difficultyLevel: shuffled[i].normalizedDifficulty
          });
          usedQuestions.add(shuffled[i].id);
        }
      }
  
      return selected;
    },
  
    /**
     * Get available questions for a difficulty level
     */
    getAvailableQuestions(difficultyQuestions, usedQuestions) {
      if (!difficultyQuestions) return {};
  
      const available = {};
      Object.entries(difficultyQuestions).forEach(([bloom, questions]) => {
        if (Array.isArray(questions)) {
          available[bloom] = questions.filter(q => q.id && !usedQuestions.has(q.id));
        }
      });
  
      return available;
    },
  
    /**
     * Create subject breakdown for UI display
     */
    createSubjectBreakdown(questions, marksPerQuestion) {
      const breakdown = {};
  
      questions.forEach(question => {
        const subject = question.subject?.trim();
        if (!subject) return;
  
        if (!breakdown[subject]) {
          breakdown[subject] = {
            questionsCount: 0,
            totalMarks: 0,
            difficulties: {},
            bloomLevels: {}
          };
        }
  
        breakdown[subject].questionsCount++;
        breakdown[subject].totalMarks += question.marks || marksPerQuestion[question.difficultyLevel] || 2;
  
        // Count difficulties
        const diff = question.difficultyLevel || question.normalizedDifficulty;
        if (diff) {
          breakdown[subject].difficulties[diff] = (breakdown[subject].difficulties[diff] || 0) + 1;
        }
  
        // Count bloom levels
        const bloom = question.bloomLevel || question.normalizedBloom;
        if (bloom) {
          breakdown[subject].bloomLevels[bloom] = (breakdown[subject].bloomLevels[bloom] || 0) + 1;
        }
      });
  
      return breakdown;
    },
  
    /**
     * Normalize difficulty levels with better mapping
     */
    normalizeDifficulty(difficulty) {
      if (!difficulty) return null;
      
      const normalized = difficulty.toString().toLowerCase().trim();
      
      // Map various difficulty representations to standard levels
      const difficultyMap = {
        'easy': 'easy',
        'simple': 'easy',
        'basic': 'easy',
        'low': 'easy',
        '1': 'easy',
        'level1': 'easy',
        'beginner': 'easy',
        
        'medium': 'medium',
        'moderate': 'medium',
        'intermediate': 'medium',
        'average': 'medium',
        '2': 'medium',
        'level2': 'medium',
        'middle': 'medium',
        
        'hard': 'hard',
        'difficult': 'hard',
        'complex': 'hard',
        'high': 'hard',
        'advanced': 'hard',
        '3': 'hard',
        'level3': 'hard',
        'expert': 'hard'
      };
  
      return difficultyMap[normalized] || 'medium';
    },
  
    /**
     * Normalize Bloom taxonomy levels with better mapping
     */
    normalizeBloomLevel(bloomLevel) {
      if (!bloomLevel) return null;
  
      const normalized = bloomLevel.toString().toLowerCase().trim();
      
      // Map various bloom representations to standard levels
      const bloomMap = {
        'remember': 'remember',
        'recall': 'remember',
        'recognize': 'remember',
        'knowledge': 'remember',
        'memorize': 'remember',
        '1': 'remember',
        'level1': 'remember',
        
        'understand': 'understand',
        'comprehend': 'understand',
        'explain': 'understand',
        'comprehension': 'understand',
        'interpret': 'understand',
        '2': 'understand',
        'level2': 'understand',
        
        'apply': 'apply',
        'use': 'apply',
        'implement': 'apply',
        'application': 'apply',
        'execute': 'apply',
        '3': 'apply',
        'level3': 'apply',
        
        'analyze': 'analyze',
        'analyse': 'analyze',
        'examine': 'analyze',
        'compare': 'analyze',
        'analysis': 'analyze',
        'differentiate': 'analyze',
        '4': 'analyze',
        'level4': 'analyze',
        
        'evaluate': 'evaluate',
        'assess': 'evaluate',
        'judge': 'evaluate',
        'evaluation': 'evaluate',
        'critique': 'evaluate',
        '5': 'evaluate',
        'level5': 'evaluate',
        
        'create': 'create',
        'design': 'create',
        'compose': 'create',
        'synthesis': 'create',
        'synthesize': 'create',
        'generate': 'create',
        '6': 'create',
        'level6': 'create'
      };
  
      return bloomMap[normalized] || 'understand';
    },
  
    /**
     * Shuffle questions to randomize order
     */
    shuffleQuestions(questions) {
      return this.shuffleArray([...questions]);
    },
  
    /**
     * Fisher-Yates shuffle algorithm
     */
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
  
    /**
     * Calculate actual statistics of selected questions
     */
    calculateActualStats(questions, marksPerQuestion) {
      const stats = {
        totalMarks: 0,
        totalQuestions: questions.length,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        bloom: { remember: 0, understand: 0, apply: 0, analyze: 0, evaluate: 0, create: 0 },
        subjects: {}
      };
  
      questions.forEach(question => {
        const marks = question.marks || marksPerQuestion[question.difficultyLevel] || 2;
        stats.totalMarks += marks;
  
        // Count by difficulty
        const difficulty = question.difficultyLevel || question.normalizedDifficulty;
        if (difficulty && stats.difficulty[difficulty] !== undefined) {
          stats.difficulty[difficulty]++;
        }
  
        // Count by bloom level
        const bloom = question.bloomLevel || question.normalizedBloom;
        if (bloom && stats.bloom[bloom] !== undefined) {
          stats.bloom[bloom]++;
        }
  
        // Count by subject
        const subject = question.subject?.trim();
        if (subject) {
          if (!stats.subjects[subject]) {
            stats.subjects[subject] = { count: 0, marks: 0 };
          }
          stats.subjects[subject].count++;
          stats.subjects[subject].marks += marks;
        }
      });
  
      return stats;
    },
  
    /**
     * Generate instructions based on paper statistics
     */
    generateInstructions(stats, timeLimit) {
      return [
        'Read all instructions carefully before attempting the paper',
        'All questions are compulsory unless otherwise specified',
        'Questions carry different marks as indicated against each question',
        'Choose the best answer for multiple choice questions',
        'Write clearly and legibly for descriptive answers',
        'Manage your time wisely - you have ' + timeLimit + ' minutes',
        'Review your answers before submission if time permits'
      ];
    }
  };