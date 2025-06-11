import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase=getSupabaseClient();

export const saveContestQuestion=async (questionData) => {
    const {data,error} = await supabase
        .from("contest_questions")
        .insert([questionData])
        .select(); // to return a single object

    if (error) throw error;
    return data;
};

export const fetchContestQuestions = async (contestId) => {
    const { data, error } = await supabase
        .from("contest_questions")
        .select()
        .eq("contest_id", contestId);

    if (error) throw error;
    return data;
};