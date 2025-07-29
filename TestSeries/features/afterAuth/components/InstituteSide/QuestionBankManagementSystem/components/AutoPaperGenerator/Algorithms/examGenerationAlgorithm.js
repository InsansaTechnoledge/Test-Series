export const examGenerationAlgorithm = {
    generateExam({ questions, config, mode = 'traditional' }) {
      console.log('Starting exam generation with config:', config, 'Mode:', mode);
      
      const {
        paperTitle,
        totalMarks,
        timeLimit,
        subjects,
        difficultyDistribution,
        marksPerQuestion,
        bloomDistribution = {},
        filters = {}
      } = config;
  
      // Apply filters first
      const filteredQuestions = this.applyFilters(questions, filters);
  
      // Choose generation strategy based on mode
      let selectedQuestions;
      if (mode === 'bloom') {
        selectedQuestions = this.selectQuestionsByBloom(filteredQuestions, config);
      } else {
        selectedQuestions = this.selectQuestionsByDifficulty(filteredQuestions, config);
      }
  
      // Shuffle and finalize paper
      const finalQuestions = this.shuffleQuestions(selectedQuestions);
      const actualStats = this.calculateActualStats(finalQuestions);
  
      // Create comprehensive paper structure
      const paper = {
        id: `paper_${Date.now()}`,
        title: paperTitle || `Auto Generated Paper - ${new Date().toLocaleDateString()}`,
        timeLimit,
        totalMarks: actualStats.totalMarks,
        totalQuestions: finalQuestions.length,
        mode,
        subjects,
        targetDistribution: mode === 'bloom' ? bloomDistribution : difficultyDistribution,
        actualDistribution: actualStats,
        questions: finalQuestions,
        generatedAt: new Date().toISOString(),
        instructions: this.generateInstructions(actualStats, timeLimit),
        subjectWiseBreakdown: this.createSubjectBreakdown(finalQuestions),
        difficultyBreakdown: actualStats.difficulty,
        bloomBreakdown: actualStats.bloom
      };
  
      return paper;
    },
  
    applyFilters(questions, filters) {
      return questions.filter(q => {
        const difficultyMatch = !filters.difficulty || filters.difficulty === 'all' || 
          q.difficulty?.toLowerCase() === filters.difficulty;
        const subjectMatch = !filters.subjectFilter || filters.subjectFilter === 'all' || 
          q.subject === filters.subjectFilter;
        const bloomMatch = !filters.bloomFilter || filters.bloomFilter === 'all' || 
          q.bloom_level?.toLowerCase() === filters.bloomFilter;
        const chapterMatch = !filters.chapterFilter || filters.chapterFilter === 'all' || 
          q.chapter === filters.chapterFilter;
        
        return difficultyMatch && subjectMatch && bloomMatch && chapterMatch;
      });
    },
  
    selectQuestionsByBloom(questions, config) {
      const { subjects, bloomDistribution, marksPerQuestion } = config;
      const selectedQuestions = [];
      const usedQuestions = new Set();
  
      // Categorize questions by subject and bloom level
      const categorized = this.categorizeQuestionsByBloom(questions);
  
      Object.entries(subjects).forEach(([subject, subjectMarks]) => {
        if (subjectMarks <= 0 || !categorized[subject]) return;
  
        Object.entries(bloomDistribution).forEach(([bloomLevel, percentage]) => {
          if (percentage <= 0) return;
  
          const targetMarks = Math.round((subjectMarks * percentage) / 100);
          const availableQuestions = categorized[subject][bloomLevel] || [];
          const filteredQuestions = availableQuestions.filter(q => !usedQuestions.has(q.id));
  
          if (filteredQuestions.length === 0) return;
  
          // Determine marks per question for this bloom level
          const avgMarks = Math.max(2, Math.round(targetMarks / Math.max(1, filteredQuestions.length / 3)));
          const questionsNeeded = Math.max(1, Math.ceil(targetMarks / avgMarks));
  
          const shuffled = this.shuffleArray([...filteredQuestions]);
          const toSelect = Math.min(questionsNeeded, shuffled.length);
  
          for (let i = 0; i < toSelect; i++) {
            selectedQuestions.push({
              ...shuffled[i],
              marks: avgMarks,
              bloomLevel: bloomLevel
            });
            usedQuestions.add(shuffled[i].id);
          }
        });
      });
  
      return selectedQuestions;
    },
  
    selectQuestionsByDifficulty(questions, config) {
      const { subjects, difficultyDistribution, marksPerQuestion } = config;
      const selectedQuestions = [];
      const usedQuestions = new Set();
  
      // Categorize questions by subject and difficulty
      const categorized = this.categorizeQuestions(questions);
  
      Object.entries(subjects).forEach(([subject, subjectMarks]) => {
        if (subjectMarks <= 0 || !categorized[subject]) return;
  
        Object.entries(difficultyDistribution).forEach(([difficulty, percentage]) => {
          if (percentage <= 0) return;
  
          const targetMarks = Math.round((subjectMarks * percentage) / 100);
          const marksPerQ = marksPerQuestion[difficulty] || 2;
          const questionsNeeded = Math.max(1, Math.ceil(targetMarks / marksPerQ));
  
          const availableQuestions = categorized[subject][difficulty] || [];
          const filteredQuestions = availableQuestions.filter(q => !usedQuestions.has(q.id));
  
          if (filteredQuestions.length === 0) return;
  
          const shuffled = this.shuffleArray([...filteredQuestions]);
          const toSelect = Math.min(questionsNeeded, shuffled.length);
  
          for (let i = 0; i < toSelect; i++) {
            selectedQuestions.push({
              ...shuffled[i],
              marks: marksPerQ,
              difficultyLevel: difficulty
            });
            usedQuestions.add(shuffled[i].id);
          }
        });
      });
  
      return selectedQuestions;
    },
  
    categorizeQuestions(questions) {
      const categorized = {};
  
      questions.forEach(question => {
        const subject = question.subject?.trim();
        const difficulty = question.difficulty?.toLowerCase()?.trim() || 'medium';
  
        if (!subject) return;
  
        if (!categorized[subject]) {
          categorized[subject] = {};
        }
  
        if (!categorized[subject][difficulty]) {
          categorized[subject][difficulty] = [];
        }
  
        categorized[subject][difficulty].push({
          ...question,
          normalizedDifficulty: difficulty
        });
      });
  
      return categorized;
    },
  
    categorizeQuestionsByBloom(questions) {
      const categorized = {};
  
      questions.forEach(question => {
        const subject = question.subject?.trim();
        const bloomLevel = question.bloom_level?.toLowerCase()?.trim() || 'understand';
  
        if (!subject) return;
  
        if (!categorized[subject]) {
          categorized[subject] = {};
        }
  
        if (!categorized[subject][bloomLevel]) {
          categorized[subject][bloomLevel] = [];
        }
  
        categorized[subject][bloomLevel].push({
          ...question,
          normalizedBloom: bloomLevel
        });
      });
  
      return categorized;
    },
  
    shuffleQuestions(questions) {
      return this.shuffleArray([...questions]);
    },
  
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
  
    calculateActualStats(questions) {
      const stats = {
        totalMarks: 0,
        totalQuestions: questions.length,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        bloom: { remember: 0, understand: 0, apply: 0, analyze: 0, evaluate: 0, create: 0 },
        subjects: {}
      };
  
      questions.forEach(question => {
        const marks = question.marks || 1;
        stats.totalMarks += marks;
  
        // Difficulty stats
        const difficulty = question.difficultyLevel || question.normalizedDifficulty || question.difficulty?.toLowerCase() || 'medium';
        if (stats.difficulty[difficulty] !== undefined) {
          stats.difficulty[difficulty]++;
        }
  
        // Bloom stats
        const bloom = question.bloomLevel || question.normalizedBloom || question.bloom_level?.toLowerCase() || 'understand';
        if (stats.bloom[bloom] !== undefined) {
          stats.bloom[bloom]++;
        }
  
        // Subject stats
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
  
    createSubjectBreakdown(questions) {
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
        breakdown[subject].totalMarks += question.marks || 1;
  
        const diff = question.difficultyLevel || question.normalizedDifficulty || question.difficulty?.toLowerCase() || 'medium';
        breakdown[subject].difficulties[diff] = (breakdown[subject].difficulties[diff] || 0) + 1;
  
        const bloom = question.bloomLevel || question.normalizedBloom || question.bloom_level?.toLowerCase() || 'understand';
        breakdown[subject].bloomLevels[bloom] = (breakdown[subject].bloomLevels[bloom] || 0) + 1;
      });
  
      return breakdown;
    },
  
    generateInstructions(stats, timeLimit) {
      return [
        'Read all instructions carefully before attempting the paper',
        'All questions are compulsory unless otherwise specified',
        'Questions carry different marks as indicated against each question',
        'Choose the best answer for multiple choice questions',
        'Write clearly and legibly for descriptive answers',
        `Manage your time wisely - you have ${timeLimit} minutes`,
        'Review your answers before submission if time permits'
      ];
    }
  };