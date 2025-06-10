export const mapQuestionData = (row, type, baseId) => {
  const safeParse = (value, fallback = []) => {
    if (!value) return fallback;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("❌ Failed to parse JSON string:", value);
        throw new Error("Invalid JSON format in question field.");
      }
    }
    return value;
  };

  try {
    switch (type) {
      case 'mcq':
        return {
          id: baseId,
          question_text: row.question_text,
          options: safeParse(row.options, []),
          correct_option: Number(row.correct_option)
        };

      case 'msq':
        return {
          id: baseId,
          question_text: row.question_text,
          options: safeParse(row.options, []),
          correct_options: safeParse(row.correct_options, [])
        };

      case 'fill':
        return {
          id: baseId,
          question_text: row.question_text,
          correct_answer: row.correct_answer
        };

      case 'tf':
        return {
          id: baseId,
          statement: row.question_text,
          is_true: row.is_true === true || row.is_true === 'true'
        };

      case 'match':
        return {
          id: baseId,
          left_items: safeParse(row.left_items, []),
          right_items: safeParse(row.right_items, []),
          correct_pairs: safeParse(row.correct_pairs, {})
        };

      case 'numerical':
        return {
          id: baseId,
          question_text: row.question_text,
          correct_answer: Number(row.correct_answer)
        };

      case 'code':
        return {
          id: baseId,
          prompt: row.question_text,
          input_format: row.input_format || '',
          output_format: row.output_format || '',
          sample_input: row.sample_input || '',
          sample_output: row.sample_output || '',
          test_cases: safeParse(row.test_cases, []),
          title: row.title || '',
          description: row.description || '',
          examples: safeParse(row.examples, []),
          constraints: safeParse(row.constraints, []),
          starter_code: row.starter_code || '',
        };

      case 'comprehension':
        return {
          id: baseId,
          passage: row.passage || '',
          sub_question_ids: (safeParse(row.sub_question_ids) || []).map(sub => sub.id)
        };

      default:
        throw new Error(`Unknown question type: ${type}`);
    }
  } catch (error) {
    console.error("❌ Error mapping question data:", error);
    throw error;
  }
};
