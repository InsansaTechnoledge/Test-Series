export const mapQuestionData = (row,type,baseId) => {
  try{
  let questionTypeData = [];
switch (type) {
        case 'mcq':
          questionTypeData.push({
            id:baseId, 
            question_text: row.question_text,
            options: JSON.parse(row.options),
            correct_option: Number(row.correct_option)
          });
          break;
        case 'msq':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            question_text: row.question_text,
            options: JSON.parse(row.options),
            correct_options: JSON.parse(row.correct_options)
          });
          break;
        case 'fill':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            question_text: row.question_text,
            correct_answer: row.correct_answer
          });
          break;
        case 'tf':
          questionTypeData.push({
            id:baseId, // Placeholder for the ID
            statement: row.question_text,
            is_true: row.is_true === true || row.is_true === 'true'
          });
          break;
        case 'match':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            left_items: JSON.parse(row.left_items),
            right_items: JSON.parse(row.right_items),
            correct_pairs: JSON.parse(row.correct_pairs)
          });
          break;
        case 'comprehension':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            passage: row.passage,
            sub_question_ids: JSON.parse(row.sub_question_ids || '[]')
          });
          break;
        case 'numerical':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            question_text: row.question_text,
            correct_answer: Number(row.correct_answer)
          });
          break;
        case 'code':
          questionTypeData.push({
            id: baseId, // Placeholder for the ID
            prompt: row.question_text,
            input_format: row.input_format,
            output_format: row.output_format,
            sample_input: row.sample_input,
            sample_output: row.sample_output,
            test_cases: JSON.parse(row.test_cases)
          });
          break;
        default:
          throw new Error(`Unknown question type: ${type}`);
      }
      return questionTypeData;
    }catch (error) {
      console.error("Error mapping question data:", error);
      throw error; // Rethrow the error to be handled by the caller
    }

}




