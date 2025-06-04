import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

// export const fetchQuestionsSelectively = async (conditions) => {
//   let query = supabase.from("questions").select("*");

//   // Dynamically apply filters based on conditions
//   Object.entries(conditions).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== '') {
//       query = query.eq(key, value);
//     }
//   });

//   const { data: questions, error } = await query;

//   if (error) throw error;


//   const allComprehensionQuestionIds = [];
//   // Fetch specialized data in parallel
//   const enrichedQuestions = await Promise.all(
//     questions.map(async (q) => {
//       const specializedTable = q.question_type;
//       if (!specializedTable) return q;

//       const { data: specializedData, error: specializedError } = await supabase
//         .from("question_" + specializedTable)
//         .select("*")
//         .eq("id", q.id)
//         .maybeSingle();

//       if (specializedError) {
//         console.warn(`Error fetching from ${specializedTable} for ID ${q.id}`, specializedError);
//         return q; // return original if fetch fails
//       }

//       if (specializedTable === 'comprehension') {
//         allComprehensionQuestionIds.push(...(specializedData.sub_question_ids || []));

//         const comprehensionSubQuestions = await Promise.all(
//           specializedData.sub_question_ids.map(async (sub_q_id) => {
//             // Fetch basic sub-question
//             const { data: subQuestion, error: subQuestionError } = await supabase
//               .from("questions")
//               .select("*")
//               .eq("id", sub_q_id)
//               .single();

//             if (subQuestionError) {
//               console.warn(`Error fetching sub-question ${sub_q_id}`, subQuestionError);
//               throw subQuestionError;
//             }

//             // Fetch sub-question specialized data
//             const subQSpecializedTable = subQuestion.question_type;
//             const { data: subSpecializedData, error: subSpecializedError } = await supabase
//               .from("question_" + subQSpecializedTable)
//               .select("*")
//               .eq("id", sub_q_id)
//               .maybeSingle();

//             if (subSpecializedError) {
//               console.warn(`Error fetching specialized sub-question data for ${sub_q_id}`, subSpecializedError);
//               // Still return base question if specialized data is missing
//               return subQuestion;
//             }

//             return {
//               ...subQuestion,
//               ...subSpecializedData,
//             };
//           })
//         );

//         return {
//           ...q,
//           ...specializedData,
//           sub_questions: comprehensionSubQuestions,
//         };
//       }

//       // Non-comprehension question
//       return {
//         ...q,
//         ...specializedData,
//       };
//     })
//   );


//   const filteredEnrichedQuestions = enrichedQuestions.filter(q => !allComprehensionQuestionIds.includes(q.id));
//   // console.log(enrichedQuestions);
//   return filteredEnrichedQuestions;
// };

export const fetchQuestionsSelectively = async (conditions) => {
  //here conditions can be done with any of the following parameters
  // Build parameters object with null defaults
  const params = {
    p_exam_id: null,
    p_organization_id: null,
    p_subject: null,
    p_chapter: null,
    p_question_type: null,
    p_difficulty: null
  };

  // Map conditions to RPC parameters
  const conditionMapping = {
    exam_id: 'p_exam_id',
    organization_id: 'p_organization_id',
    subject: 'p_subject',
    chapter: 'p_chapter',
    question_type: 'p_question_type',
    difficulty: 'p_difficulty'
  };

  // Apply conditions dynamically (same logic as your original)
  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const paramKey = conditionMapping[key];
      if (paramKey) {
        params[paramKey] = value;
      }
    }
  });

  const { data: questions, error } = await supabase.rpc('fetch_questions_selectively', params);

  if (error) throw error;
  return questions; // Returns JSONB array with enriched questions
};

export const updateQuestion = async (question, id) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .update(question)
    .eq('id', id)

  if (error) throw error;
  return data;
}

export const deleteQuestion = async (id) => {
  const { data, error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteQuestionsBulk = async (ids) => {
  const { data, error } = await supabase
    .from("questions")
    .delete()
    .in("id", ids)
    .select();

  if (error) throw error;
  return data;
};
