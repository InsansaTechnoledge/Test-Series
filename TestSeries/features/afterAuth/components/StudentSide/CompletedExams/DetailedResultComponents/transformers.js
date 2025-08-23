export const transformQuestions = (questions) => {
  return questions.map((q) => {
    let transformed = {
      id: q.id,
      question_text: q.question_text || (q.question_type === "tf" ? q.statement : ""),
      type: q.question_type,
      difficulty: q.difficulty,
      positive_marks: q.positive_marks,
      negative_marks: q.negative_marks,
      subject: q.subject,
      chapter: q.chapter,
      options: q.options,
      correct_option: q.correct_option,
      correct_options: q.correct_options,
      correct_answer: q.correct_answer,
      is_true: q.is_true,
      explanation: q.explanation,
      left_items: q.left_items,
      right_items: q.right_items,
      correct_pairs: q.correct_pairs,
      passage: q.passage,
      sub_question_ids: q.sub_question_ids,
      // Added support for descriptive questions
      reference_answer: q.reference_answer,
      word_limit: q.word_limit,
      sample_answer: q.sample_answer,
    };

    if (q.question_type === "comprehension" && Array.isArray(q.sub_questions)) {
      transformed.sub_questions = q.sub_questions.map((sub) => ({
        id: sub.id,
        question_text: sub.question_text || (sub.question_type === "tf" ? sub.statement : ""),
        type: sub.question_type,
        difficulty: sub.difficulty,
        positive_marks: sub.positive_marks,
        negative_marks: sub.negative_marks,
        subject: sub.subject,
        chapter: sub.chapter,
        options: sub.options,
        correct_option: sub.correct_option,
        correct_options: sub.correct_options,
        correct_answer: sub.correct_answer,
        is_true: sub.is_true,
        explanation: sub.explanation,
        descriptive_answer: sub.descriptive_answer,
        word_limit: sub.word_limit,
        sample_answer: sub.sample_answer,
      }));
    }

    return transformed;
  });
};

export const transformUserAnswers = (wrongAnswers, questions, resultData, descriptiveResponses) => {
  const userAnswers = {};

  // Initialize all questions (including sub-questions) as null
  questions.forEach((q) => {
    userAnswers[q.id] = null;
    if (q.question_type === "comprehension" && Array.isArray(q.sub_questions)) {
      q.sub_questions.forEach((sub) => {
        userAnswers[sub.id] = null;
      });
    }
  });

  // Set wrong answers
  wrongAnswers.forEach((wrong) => {
    userAnswers[wrong.questionId] = wrong.response;
    
  });

  descriptiveResponses.forEach((response) => {
    userAnswers[response.questionId] = response.response;
  });

  // Set correct answers for questions that were answered correctly
  questions.forEach((q) => {
    if (q.question_type === "comprehension" && Array.isArray(q.sub_questions)) {
      q.sub_questions.forEach((sub) => {
        if (!wrongAnswers.find((w) => w.questionId === sub.id) &&
            (!resultData.unattempted || !resultData.unattempted.includes(sub.id))) {
          setCorrectAnswer(sub, userAnswers);
        }
      });
    } else {
      if (!wrongAnswers.find((w) => w.questionId === q.id) &&
          (!resultData.unattempted || !resultData.unattempted.includes(q.id))) {
        setCorrectAnswer(q, userAnswers);
      }
    }
  });



  return userAnswers;
};

const setCorrectAnswer = (question, userAnswers) => {

  if (question.question_type === "mcq") {
    console.log("Setting correct answer for MCQ:", question.id, question.correct_option);
    userAnswers[question.id] = question.correct_option;
  } else if (question.question_type === "msq") {
    userAnswers[question.id] = question.correct_options;
  } else if (question.question_type === "tf") {
    userAnswers[question.id] = question.is_true;
  } else if (question.question_type === "fill" || question.question_type === "numerical") {
    userAnswers[question.id] = question.correct_answer;
  } else if (question.question_type === "match") {
    userAnswers[question.id] = question.correct_pairs;
  } 
};

export const transformResultCorrectAnswer = (question) => {
      if (question.type === "mcq") {
    return question.correct_option;
  } else if (question.type === "msq") {
    return question.correct_options;
  } else if (question.type === "tf") {
    return  question.is_true;
  } else if (question.type === "fill" || question.type === "numerical") {
    return question.correct_answer;
  } else if (question.type === "match") {
    return question.correct_pairs;
  } else if (question.type === "descriptive") {
    // For descriptive questions, we might not have a "correct" answer
    // but we can show their submitted answer
    return question.reference_answer || null;
  }
}

// utils/resultCalculator.js
