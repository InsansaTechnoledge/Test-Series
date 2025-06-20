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
    .update([examData])
    .eq('id', examId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchSelective = async (conditions) => {
  let query = supabase
    .from("batch_exam")
    .select(`
      id,
      name,
      date,
      duration,
      total_marks,
      organization_id,
      batch_id,
       go_live,
      batch:batch_id (
        name,
        year
      ),
      reapplicable
    `);

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};



export const fetchExamNameById = async (examId) => {
  const { data, error } = await supabase
    .from("batch_exam")
    .select("*")
    .eq("id", examId)
    .single();

  if (error) throw error;
  return data.name;
};




// export const setExamLive = async (examId,orgId) => {
//   const { data, error } = await supabase
//   .from('batch_exam')
//   .update({
//     go_live: true,
//     updated_at: new Date()
//   })
//   .eq('id', examId)
//   .eq('organization_id', orgId)
//   .select()
//   .single();

//     if (error) throw error;
//     return data;
//   };

//   if (error) throw error;
//   return data.name;
// };


export const fetchExamNames = async (batch_id) => {
  const { data, error } = await supabase
    .from("batch_exam")
    .select("name, id")
    .eq("batch_id", batch_id);

  if (error) throw error;
  return data
}

export const deleteExam = async (id, batch_id) => {
  let query = id ?
    supabase
      .from("batch_exam")
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle()
    :
    supabase
      .from("batch_exam")
      .delete()
      .eq('batch_id', batch_id)
      .select()
      .maybeSingle();

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const setExamLive = async (examId, orgId, status) => {
  const { data, error } = await supabase
    .from('batch_exam')
    .update({
      go_live: status,  
      updated_at: new Date() 
    })
    
    .eq('id', examId)
    .eq('organization_id', orgId)
    .select()
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

// export const fetchExamsWithoutQuestionsQuery = async () => {
//   const { data, error } = await supabase
//     .from('batch_exam')
//     .select('*, questions(id)')
//     .is('questions.id', null); // exams with no questions

//   if (error) throw error;

//   return data;
// };

export const fetchExamsWithoutQuestionsQuery = async (organization_id) => {
  const { data, error } = await supabase
    .rpc('get_exams_without_questions', { org_id: organization_id });
  if (error) throw error;
  return data;
};

export const getExamCountForOrg=async (organization_id) => {
  const { count, error } = await supabase
    .from('batch_exam')
    .select('id', { count: 'exact',head: true })
    .eq('organization_id', organization_id);

  if (error) throw error;
  return count;
}

