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

  