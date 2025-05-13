import { getSupabaseClient } from "../database/SupabaseDB";

const supabase = getSupabaseClient();

export const fetchQuestionsByExam = async (examId) => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("exam_id", examId);
  
    if (error) throw error;
    return data;
  };

export const updateQuestion = async (question, id) => {
  const { data, error } = await supabase
  .from("questions")
  .select("*")
  .update(question)
  .eq('id', id)

  if(error) throw error;
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
