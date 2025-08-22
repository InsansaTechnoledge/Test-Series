export const getQuestionResult = (question, userAnswers, theme) => {
  if (question.type === "comprehension" && Array.isArray(question.sub_questions)) {
    let allAnswered = true;
    let allCorrect = true;
    let hasCorrect = false;

    question.sub_questions.forEach((subQ) => {
      const subResult = getQuestionResult(subQ, userAnswers, theme);
      if (subResult.status === "unanswered") {
        allAnswered = false;
      } else if (subResult.status === "incorrect") {
        allCorrect = false;
      } else if (subResult.status === "correct") {
        hasCorrect = true;
      }
    });

    if (!allAnswered) {
      return {
        status: "unanswered",
        class: theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700",
        label: "Partially Answered",
        icon: "◐",
      };
    } else if (allCorrect) {
      return {
        status: "correct",
        class: theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800",
        label: "All Correct",
        icon: "✓",
      };
    } else if (hasCorrect) {
      return {
        status: "partial",
        class: theme === "dark" ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800",
        label: "Partially Correct",
        icon: "◑",
      };
    } else {
      return {
        status: "incorrect",
        class: theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800",
        label: "All Incorrect",
        icon: "✗",
      };
    }
  }

  const userAnswer = userAnswers[question.id];

  if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
    return {
      status: "unanswered",
      class: theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700",
      label: "Not Answered",
      icon: "○",
    };
  }

  // For descriptive questions, we mark them as "answered" but need manual evaluation
  if (question.type === "descriptive") {
    return {
      status: "descriptive",
      class: theme === "dark" ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800",
      label: "Descriptive Answer",
      icon: "📝",
    };
  }

  let isCorrect = false;

  if (question.type === "mcq") {
    isCorrect = userAnswer === question.correct_option;
  } else if (question.type === "msq") {
    isCorrect = JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.correct_options?.sort());
  } else if (question.type === "tf") {
    isCorrect = userAnswer === question.is_true;
  } else if (question.type === "fill" || question.type === "numerical") {
    isCorrect = userAnswer?.toString().toLowerCase().trim() === question.correct_answer?.toString().toLowerCase().trim();
  } else if (question.type === "match") {
    const sortObject = (obj) => {
      return Object.keys(obj || {}).sort().reduce((res, key) => {
        res[key] = obj[key];
        return res;
      }, {});
    };
    const correct = JSON.stringify(sortObject(question.correct_pairs));
    const answer = JSON.stringify(sortObject(userAnswer));
    isCorrect = correct === answer;
  }

  if (isCorrect) {
    return {
      status: "correct",
      class: theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800",
      label: "Correct",
      icon: "✓",
    };
  } else {
    return {
      status: "incorrect",
      class: theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800",
      label: "Incorrect",
      icon: "✗",
    };
  }
};

export const getFilteredQuestions = (questions, userAnswers, searchTerm, filterType, filterResult, theme) => {
  return questions.filter((q) => {
    const text = q.question_text || q.passage || "";
    const subject = q.subject || "";
    const chapter = q.chapter || "";

    let matchesSearch = text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       chapter.toLowerCase().includes(searchTerm.toLowerCase());

    if (q.type === "comprehension" && Array.isArray(q.sub_questions)) {
      matchesSearch = matchesSearch || q.sub_questions.some((sub) =>
        (sub.question_text || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const matchesType = filterType === "all" || q.type === filterType;
    const result = getQuestionResult(q, userAnswers, theme);
    const matchesResult = filterResult === "all" ||
                         (filterResult === "correct" && result.status === "correct") ||
                         (filterResult === "incorrect" && (result.status === "incorrect" || result.status === "partial")) ||
                         (filterResult === "unanswered" && result.status === "unanswered") ||
                         (filterResult === "descriptive" && result.status === "descriptive");

    return matchesSearch && matchesType && matchesResult;
  });
};

export const calculateTotalMarks = (questions) => {
  return questions.reduce((sum, q) => {
    if (q.type === "comprehension" && Array.isArray(q.sub_questions)) {
      return sum + q.sub_questions.reduce((subSum, sub) => subSum + (Number(sub.positive_marks) || 0), 0);
    }
    return sum + (Number(q.positive_marks) || 0);
  }, 0);
};