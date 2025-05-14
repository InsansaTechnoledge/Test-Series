import { getSupabaseClient } from "../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const fetchQuestionsSelectively = async (conditions) => {
    let query = supabase.from("questions").select("*");

    // Dynamically apply filters based on conditions
    Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
        }
    });

    const { data, error } = await query;

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
