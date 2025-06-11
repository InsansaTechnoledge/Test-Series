import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const createContestQuery=async(contestData)=>{
    const { data, error } = await supabase
        .from("organization_contest")
        .insert([contestData])
        .select();

    if (error) throw error;
    return data;
};