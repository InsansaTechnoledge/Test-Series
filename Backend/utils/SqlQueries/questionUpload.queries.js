import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

// export const insertBaseQuestion = async ({

//     exam_id, organization_id, subject, chapter,

//     question_type, difficulty, explanation, marks

// }) => {

//     const { data, error } = await supabase

//         .from('questions')

//         .insert([{

//             exam_id,

//             organization_id,

//             subject,

//             chapter,

//             question_type,

//             difficulty,

//             explanation,

//             marks

//         }])

//         .select()

//         .single();

//     return { data, error };

// };

// export const insertMCQ = async (id, row) => {

//     return await supabase.from('question_mcq').insert([{

//         id,

//         question_text: row.question_text,

//         options: JSON.parse(row.options),

//         correct_option: Number(row.correct_option)

//     }]);

// };

// export const insertMSQ = async (id, row) => {

//     return await supabase.from('question_msq').insert([{

//         id,

//         question_text: row.question_text,

//         options: JSON.parse(row.options),

//         correct_options: JSON.parse(row.correct_options)

//     }]);

// };

// export const insertFILL = async (id, row) => {

//     return await supabase.from('question_fill').insert([{

//         id,

//         question_text: row.question_text,

//         correct_answer: row.correct_answer

//     }]);

// };

// export const insertTF = async (id, row) => {

//     return await supabase.from('question_tf').insert([{

//         id,

//         statement: row.question_text,

//         is_true: row.is_true === true || row.is_true === 'true'

//     }]);

// };

// export const insertMatch = async (id, row) => {
//   return await supabase.from('question_match').insert([{
//     id,
//     left_items: JSON.parse(row.left_items),
//     right_items: JSON.parse(row.right_items),
//     correct_pairs: JSON.parse(row.correct_pairs)
//   }]);
// };
 
// export const insertComprehension = async (id, row) => {
//   return await supabase.from('question_comprehension').insert([{
//     id,
//     passage: row.passage,
//     sub_question_ids: JSON.parse(row.sub_question_ids || '[]')
//   }]);
// };
 
// export const insertNumerical = async (id, row) => {
//   return await supabase.from('question_numerical').insert([{
//     id,
//     question_text: row.question_text,
//     correct_answer: Number(row.correct_answer)
//   }]);
// };
 
// export const insertCode = async (id, row) => {
//   return await supabase.from('question_code').insert([{
//     id,
//     prompt: row.question_text,
//     input_format: row.input_format,
//     output_format: row.output_format,
//     sample_input: row.sample_input,
//     sample_output: row.sample_output,
//     test_cases: JSON.parse(row.test_cases)
//   }]);
// };


export const insertBaseQuestion = async (questionData) => {
  const {data,error}=await supabase.from('questions').insert(questionData).select();
  if (error) {
    console.error('Error inserting question:', error);
    throw error;
  }

  return data;
};

export const insertMCQ = async (mcqData) => {
  const { data, error } = await supabase.from('question_mcq').insert(mcqData).select();
  if (error) {
    console.error('Error inserting MCQ:', error);
    throw error;
  }
  return data;
};

export const insertMSQ = async (msqData) => {
  const { data, error } = await supabase.from('question_msq').insert(msqData).select();
  if (error) {
    console.error('Error inserting MSQ:', error);
    throw error;
  }
  return data;
};

export const insertFILL = async (fillData) => {
  const { data, error } = await supabase.from('question_fill').insert(fillData).select();
  if (error) {
    console.error('Error inserting FILL:', error);
    throw error;
  }
  return data;
};

export const insertTF = async (tfData) => {
  const { data, error } = await supabase.from('question_tf').insert(tfData).select();
  if (error) {
    console.error('Error inserting TF:', error);
    throw error;
  }
  return data;
};

export const insertMatch = async (matchData) => {
  const { data, error } = await supabase.from('question_match').insert(matchData).select();
  if (error) {
    console.error('Error inserting Match:', error);
    throw error;
  }
  return data;
};

export const insertComprehension = async (comprehensionData) => {
  const { data, error } = await supabase.from('question_comprehension').insert(comprehensionData).select();
  if (error) {
    console.error('Error inserting Comprehension:', error);
    throw error;
  }
  return data;
};

export const insertNumerical = async (numericalData) => {
  const { data, error } = await supabase.from('question_numerical').insert(numericalData).select();
  if (error) {
    console.error('Error inserting Numerical:', error);
    throw error;
  }
  return data;
};

export const insertCode = async (codeData) => {
  const { data, error } = await supabase.from('question_code').insert(codeData).select();
  if (error) {
    console.error('Error inserting Code:', error);
    throw error;
  }
  return data;
};
