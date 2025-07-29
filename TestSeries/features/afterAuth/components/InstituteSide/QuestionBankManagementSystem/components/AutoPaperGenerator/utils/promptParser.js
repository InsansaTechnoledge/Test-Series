import { analysisUtils } from "./analysisUtils";

export const promptParser = {
  parsePrompt: (prompt, questions) => {
    const lowercasePrompt = prompt.toLowerCase();
    const config = {
      paperTitle: 'AI Generated Paper',
      totalMarks: 100,
      timeLimit: 60,
      subjects: {},
      difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
      marksPerQuestion: { easy: 2, medium: 4, hard: 6 },
      bloomDistribution: {},
      filters: {
        difficulty: 'all',
        subjectFilter: 'all',
        bloomFilter: 'all',
        chapterFilter: 'all'
      }
    };

    // Extract subjects
    const availableSubjects = Object.keys(analysisUtils.analyzeQuestions(questions).subjects);
    availableSubjects.forEach(subject => {
      if (lowercasePrompt.includes(subject.toLowerCase())) {
        config.subjects[subject] = 30; // Default allocation
      }
    });

    // Extract marks
    const marksMatch = lowercasePrompt.match(/(\d+)\s*marks?/);
    if (marksMatch) {
      config.totalMarks = parseInt(marksMatch[1]);
    }

    // Extract time
    const timeMatch = lowercasePrompt.match(/(\d+)\s*(minutes?|mins?|hours?)/);
    if (timeMatch) {
      const time = parseInt(timeMatch[1]);
      config.timeLimit = timeMatch[2].includes('hour') ? time * 60 : time;
    }

    // Extract difficulty preferences
    if (lowercasePrompt.includes('easy')) {
      config.difficultyDistribution = { easy: 60, medium: 30, hard: 10 };
    } else if (lowercasePrompt.includes('hard') || lowercasePrompt.includes('difficult')) {
      config.difficultyDistribution = { easy: 10, medium: 30, hard: 60 };
    } else if (lowercasePrompt.includes('medium') || lowercasePrompt.includes('moderate')) {
      config.difficultyDistribution = { easy: 20, medium: 60, hard: 20 };
    }

    // Extract Bloom's taxonomy preferences
    const bloomKeywords = {
      'remember': ['remember', 'recall', 'memorize', 'recognize'],
      'understand': ['understand', 'comprehend', 'explain', 'interpret'],
      'apply': ['apply', 'implement', 'use', 'solve'],
      'analyze': ['analyze', 'examine', 'compare', 'contrast'],
      'evaluate': ['evaluate', 'assess', 'judge', 'critique'],
      'create': ['create', 'design', 'develop', 'synthesize']
    };

    Object.entries(bloomKeywords).forEach(([level, keywords]) => {
      if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
        config.bloomDistribution[level] = 40;
      }
    });

    // If no specific subjects mentioned, distribute equally among available
    if (Object.keys(config.subjects).length === 0) {
      const marksPerSubject = Math.floor(config.totalMarks / availableSubjects.length);
      availableSubjects.forEach(subject => {
        config.subjects[subject] = marksPerSubject;
      });
    }

    return config;
  },

  getSamplePrompts: () => [
    "Create a 50 marks programming exam focusing on easy to medium difficulty questions in 45 minutes",
    "Generate a computer architecture paper with 80 marks, emphasizing analysis and evaluation questions",
    "Make a balanced exam covering programming and computer architecture, 60 minutes, moderate difficulty",
    "Create an exam with questions that test understanding and application skills, 100 marks",
    "Generate a quick 30 marks test focusing on basic concepts and recall questions",
    "Design a comprehensive exam testing all cognitive levels from remember to create, 120 minutes"
  ]
};