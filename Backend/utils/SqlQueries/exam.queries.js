import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const createExam = async (examData) => {
    const { data, error } = await supabase
        .from("exam")
        .insert(examData)
        .select()

    if (error) throw error;
    return data;
}

export const updateExam = async (examData, examId) => {
    const { data, error } = await supabase
        .from("exam")
        .update(examData)
        .eq('id', examId)
        .select()

    if (error) throw error;
    return data;
}

export const fetchSelective = async (conditions) => {
    let query = supabase.from("exam").
    select(`*,
        batch_id (
            name,
            year
        `);

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
    .eq('id', id)
    .select();

    if(error) throw error;
    return data;
}