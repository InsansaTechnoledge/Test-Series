import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const fetchQuestionsSelectively = async (conditions) => {
  //here conditions can be done with any of the following parameters
  // Build parameters object with null defaults
  const params = {
    p_exam_id: null,
    p_organization_id: null,
    p_subject: null,
    p_chapter: null,
    p_question_type: null,
    p_difficulty: null,
    p_already_given_exam:false
  };

  // Map conditions to RPC parameters
  const conditionMapping = {
    exam_id: 'p_exam_id',
    organization_id: 'p_organization_id',
    subject: 'p_subject',
    chapter: 'p_chapter',
    question_type: 'p_question_type',
    difficulty: 'p_difficulty',
    already_given_exam: 'p_already_given_exam'
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
