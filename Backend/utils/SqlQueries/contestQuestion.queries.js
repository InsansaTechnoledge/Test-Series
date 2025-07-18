import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const saveContestQuestion = async (contestId, questions) => {
    const dataToInsert = questions.map((q) => ({
        ...q,
        contest_id: contestId,
    }));
    console.log("Data to Insert:", dataToInsert);
    const { data, error } = await supabase
        .from("contestxcoding_questions")
        .insert(dataToInsert)
        .select();

    if (error) throw error;
    return data;
};

// export const fetchContestQuestions = async (contestId) => {
//     const { data, error } = await supabase
//         .from("contest_questions")
//         .select()
//         .eq("contest_id", contestId);


//     if (error) throw error;
//     return data;
// };