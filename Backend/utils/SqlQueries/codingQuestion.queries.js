import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const getCodingQuestions = async (difficulty, page = 1, limit = 10, id) => {
  let data = [];
  let error = null;
  let count = 0;

  if (!id) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const result = await supabase
      .from("coding_questions")
      .select("id, title, title_slug, difficulty, created_at", { count: "exact" })
      .ilike("difficulty", difficulty)
      .range(from, to)
      .order("created_at", { ascending: false });

    data = result.data;
    error = result.error;
    count = result.count;

    console.log("Fetched coding questions:", { difficulty, page, limit, data, count });
  } else {
    const result = await supabase
      .from("coding_questions")
      .select()
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;

    console.log("Fetched coding question by ID:", { id, data });
  }

  if (error) throw error;

  return {
    data,
    totalCount: count,
    totalPages: id ? 1 : Math.ceil(count / limit),
  };
};

export const getContestQuetionsQuery = async (contest_id)=>{
  const {data,error}=await supabase
  .rpc('get_contest_coding_question',{
    p_contest_id: contest_id
  });

  if(error){
    throw error;
  }
  return data;

};
