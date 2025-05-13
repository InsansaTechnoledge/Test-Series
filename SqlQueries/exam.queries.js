import { getSupabaseClient } from "../database/SupabaseDB";

const supabase = getSupabaseClient();

export const createExam = async (examData) => {
    const { data, error } = await supabase
        .from("exam")
        .insert(examData)

    if (error) throw error;
    return data;
}

export const updateExam = async (examData, examId) => {
    const { data, error } = await supabase
        .from("exam")
        .update(examData)
        .eq('id', examId)

    if (error) throw error;
    return data;
}

export const fetchSelective = async (conditions) => {
    let query = supabase.from("exam").select("*");

    // Dynamically apply filters based on conditions
    Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
        }
    });

    const { data, error } = await query;

    if (error) throw error;
    return data;
}

export const deleteExam = async (id) => {
    const {data, error} = await supabase
    .from("exam")
    .delete()
    .eq('id', id);

    if(error) throw error;
    return data;
}