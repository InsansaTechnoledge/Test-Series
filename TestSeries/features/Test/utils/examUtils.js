// Utility to determine correct response based on question type
export const getCorrectResponse = (question) => {
  if (!question) return null;
  
  try {
    switch (question.question_type) {
      case "mcq":
        return question.correct_option ?? null;
      case "msq":
        return question.correct_options ?? [];
      case "fill":
      case "numerical":
        return question.correct_answer ?? null;
      case "tf":
        return question.is_true ?? null;
      case "match":
        return question.correct_pairs ?? [];
      case "comprehension":
        if (!question.sub_questions || !Array.isArray(question.sub_questions)) {
          return {};
        }
        return question.sub_questions.reduce((acc, sub_q) => {
          if (!sub_q || !sub_q.id) return acc;
          
          const response = getCorrectResponse(sub_q);
          return {
            ...acc,
            [sub_q.id]: [
              response,
              sub_q.positive_marks || 0,
              sub_q.negative_marks || 0,
              sub_q.question_type || 'mcq',
            ],
          };
        }, {});
      default:
        return question.correct_response ?? null;
    }
  } catch (error) {
    console.error('Error getting correct response for question:', question?.id, error);
    return null;
  }
};

// Calculate result and format payload for submission
export const calculateResultPayload = (subjectSpecificQuestions, getCorrectResponseFn) => {
  if (!subjectSpecificQuestions || typeof subjectSpecificQuestions !== 'object') {
    console.error('Invalid subjectSpecificQuestions provided');
    return {
      marks: 0,
      wrongAnswers: 0,
      unattempted: 0,
    };
  }

  let allResponses = [];
  
  try {
    allResponses = Object.entries(subjectSpecificQuestions).flatMap(([subject, questions]) => {
      if (!Array.isArray(questions)) {
        console.warn(`Questions for subject ${subject} is not an array`);
        return [];
      }
      
      return questions.map((q) => {
        if (!q || !q.id) {
          console.warn('Invalid question found:', q);
          return null;
        }
        
        try {
          return {
            question_id: q.id,
            user_response: q.response,
            correct_response: getCorrectResponseFn(q),
            question_type: q.question_type || 'mcq',
            positive_marks: parseFloat(q.positive_marks) || 0,
            negative_marks: parseFloat(q.negative_marks) || 0,
          };
        } catch (error) {
          console.error('Error processing question:', q.id, error);
          return null;
        }
      }).filter(Boolean); // Remove null entries
    });
  } catch (error) {
    console.error('Error creating response array:', error);
    return {
      marks: 0,
      wrongAnswers: 0,
      unattempted: 0,
    };
  }

  let totalMarks = 0;
  let wrongAnswers = 0;
  let unattempted = 0;

  for (let q of allResponses) {
    try {
      const attempted = isAttempted(q.user_response);
      
      if (!attempted) {
        unattempted += 1;
        continue;
      }

      const isCorrect = isResponseCorrect(q.user_response, q.correct_response, q.question_type);
      
      if (isCorrect) {
        totalMarks += q.positive_marks;
      } else {
        totalMarks -= q.negative_marks;
        wrongAnswers += 1;
      }
    } catch (error) {
      console.error('Error calculating result for question:', q.question_id, error);
      // Treat as unattempted on error
      unattempted += 1;
    }
  }

  return {
    marks: Math.round(totalMarks * 100) / 100, // Round to 2 decimal places
    wrongAnswers,
    unattempted,
  };
};

// Helper function to check if a response is attempted
const isAttempted = (response) => {
  if (response === null || response === undefined) return false;
  if (typeof response === 'string' && response.trim() === '') return false;
  if (Array.isArray(response) && response.length === 0) return false;
  if (typeof response === 'object' && Object.keys(response).length === 0) return false;
  return true;
};

// Logic to verify correctness of the response
const isResponseCorrect = (userResponse, correctResponse, questionType) => {
  if (!isAttempted(userResponse)) return false;
  
  try {
    switch (questionType) {
      case 'mcq':
      case 'numerical':
      case 'fill':
      case 'tf':
        return normalizeResponse(userResponse) === normalizeResponse(correctResponse);
      
      case 'msq':
        return compareArrays(userResponse, correctResponse);
      
      case 'match':
        return compareObjects(userResponse, correctResponse);
      
      case 'comprehension':
        return compareComprehension(userResponse, correctResponse);
      
      default:
        console.warn('Unknown question type:', questionType);
        return normalizeResponse(userResponse) === normalizeResponse(correctResponse);
    }
  } catch (error) {
    console.error('Error comparing responses:', error);
    return false;
  }
};

// Helper function to normalize responses for comparison
const normalizeResponse = (response) => {
  if (response === null || response === undefined) return null;
  if (typeof response === 'string') return response.trim().toLowerCase();
  if (typeof response === 'number') return response;
  if (typeof response === 'boolean') return response;
  return response;
};

// Helper function to compare arrays (for MSQ)
const compareArrays = (userArray, correctArray) => {
  if (!Array.isArray(userArray) || !Array.isArray(correctArray)) return false;
  if (userArray.length !== correctArray.length) return false;
  
  const normalizedUser = userArray.map(normalizeResponse).sort();
  const normalizedCorrect = correctArray.map(normalizeResponse).sort();
  
  return normalizedUser.every((val, index) => val === normalizedCorrect[index]);
};

// Helper function to compare objects (for matching)
const compareObjects = (userObj, correctObj) => {
  if (!userObj || !correctObj) return false;
  if (typeof userObj !== 'object' || typeof correctObj !== 'object') return false;
  
  try {
    // For matching questions, we typically compare the structure
    const userKeys = Object.keys(userObj).sort();
    const correctKeys = Object.keys(correctObj).sort();
    
    if (userKeys.length !== correctKeys.length) return false;
    if (!userKeys.every(key => correctKeys.includes(key))) return false;
    
    return userKeys.every(key => 
      normalizeResponse(userObj[key]) === normalizeResponse(correctObj[key])
    );
  } catch (error) {
    console.error('Error comparing objects:', error);
    return false;
  }
};

// Helper function to compare comprehension responses
const compareComprehension = (userResponses, correctResponses) => {
  if (!userResponses || !correctResponses) return false;
  if (typeof userResponses !== 'object' || typeof correctResponses !== 'object') return false;
  
  try {
    const correctKeys = Object.keys(correctResponses);
    
    return correctKeys.every(subId => {
      const userResponse = userResponses[subId];
      const correctData = correctResponses[subId];
      
      if (!correctData || !Array.isArray(correctData)) return false;
      
      const [correctResponse, , , questionType] = correctData;
      return isResponseCorrect(userResponse, correctResponse, questionType);
    });
  } catch (error) {
    console.error('Error comparing comprehension responses:', error);
    return false;
  }
};

// Enhanced error handling wrapper
export const safeCalculateResult = (subjectSpecificQuestions, getCorrectResponseFn) => {
  try {
    return calculateResultPayload(subjectSpecificQuestions, getCorrectResponseFn);
  } catch (error) {
    console.error('Critical error in result calculation:', error);
    return {
      marks: 0,
      wrongAnswers: 0,
      unattempted: Object.values(subjectSpecificQuestions || {})
        .flat()
        .filter(q => q && q.id).length,
    };
  }
};

// Utility to validate exam data before processing
export const validateExamData = (eventDetails, subjectSpecificQuestions) => {
  const errors = [];
  
  if (!eventDetails) {
    errors.push('Event details are missing');
  }
  
  if (!subjectSpecificQuestions || typeof subjectSpecificQuestions !== 'object') {
    errors.push('Subject specific questions are invalid');
  } else {
    Object.entries(subjectSpecificQuestions).forEach(([subject, questions]) => {
      if (!Array.isArray(questions)) {
        errors.push(`Questions for subject ${subject} are not in array format`);
      } else if (questions.length === 0) {
        errors.push(`No questions found for subject ${subject}`);
      } else {
        questions.forEach((q, index) => {
          if (!q || !q.id) {
            errors.push(`Invalid question at index ${index} in subject ${subject}`);
          }
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};