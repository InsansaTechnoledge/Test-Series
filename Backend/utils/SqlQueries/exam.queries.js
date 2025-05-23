import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const createExam = async (examData) => {
    const { data, error } = await supabase
        .from("batch_exam")
        .insert([examData])
        .select()
        .single(); // to return a single object

    if (error) throw error;
    return data;
};

export const updateExam = async (examData, examId) => {
    const { data, error } = await supabase
        .from("batch_exam")
        .update(examData)
        .eq('id', examId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const fetchSelective = async (conditions) => {
    let query = supabase
      .from("batch_exam")
      .select(
        `*,
         batch_id (
           name,
           year
         )`
      );
  
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });
  
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };
  

export const deleteExam = async (id) => {
    const { data, error } = await supabase
        .from("batch_exam")
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const setExamLive = async (examId) => {
    const { data, error } = await supabase
      .from('batch_exam')
      .update({
        go_live: true,   // this will also trigger status = 'live' if you added the trigger
        updated_at: new Date()
      })
      .eq('id', examId)
      .select()
      .single();
  
    if (error) throw error;
    return data;
  };

  export const getExamOrganization = async (id) => {
    const { data, error } = await supabase
      .from("batch_exam")
      .select("organization_id")
      .eq("id", id)
      .single();
  
    if (error) throw error;
    return data;
  };

  export const fetchNonLiveExams = async (organization_id) => {
    const { data, error } = await supabase
      .from("batch_exam")
      .select(`*,
        batch_id (
          name,
          year
        )
      `)
      .eq("go_live", false)
      .eq("organization_id", organization_id);
  
    if (error) throw error;
    return data;
  };