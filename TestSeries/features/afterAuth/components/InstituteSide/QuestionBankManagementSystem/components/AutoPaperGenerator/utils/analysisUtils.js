export const analysisUtils = {
    analyzeQuestions: (questions) => {
      const subjects = {};
      const difficulties = new Set();
      const bloomLevels = new Set();
      const chapters = new Set();
  
      questions.forEach(q => {
        // Subject analysis
        const subject = q.subject?.trim();
        if (subject) {
          subjects[subject] = (subjects[subject] || 0) + 1;
        }
  
        // Difficulty analysis
        const difficulty = q.difficulty?.toLowerCase()?.trim();
        if (difficulty) {
          difficulties.add(difficulty);
        }
  
        // Bloom level analysis
        const bloom = q.bloom_level?.toLowerCase()?.trim();
        if (bloom) {
          bloomLevels.add(bloom);
        }
  
        // Chapter analysis
        const chapter = q.chapter?.trim();
        if (chapter) {
          chapters.add(chapter);
        }
      });
  
      return {
        subjects,
        difficulties: Array.from(difficulties),
        bloomLevels: Array.from(bloomLevels),
        chapters: Array.from(chapters)
      };
    }
  };