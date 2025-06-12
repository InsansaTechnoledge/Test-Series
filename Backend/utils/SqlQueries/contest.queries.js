import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const createContestQuery=async(contestData)=>{
    const { data, error } = await supabase
        .from("organization_contest")
        .insert(contestData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// export const fetchContestWithoutQuestions=async (organizationId)=>{
//     const { data, error } = await supabase
//         .from("organization_contest")
//         .select()
//         .eq("organization_id", organizationId)

//     if (error) throw error;
//     return data;
// }