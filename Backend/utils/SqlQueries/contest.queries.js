import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const createContestQuery = async (payload) => {
    const rpcPayload = {
        p_selected_batches: payload.selectedBatches, 
        p_organization_id: payload.organization_id,
        p_name: payload.name,
        p_type: payload.type,
        p_schedule: payload.schedule,
        p_duration: payload.duration,
        p_live_until: payload.live_until,
        p_go_live: payload.go_live,
        p_created_at: payload.created_at,
        p_updated_at: payload.updated_at,
        p_description: payload.description,
        p_validity: payload.validity 
    };



    const { data, error } = await supabase
        .rpc('create_contest_with_batches', rpcPayload)
        .select();

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

export const fetchContest = async (organizationId, batchId,userId) => {
  let data, error;

   if (!batchId && !userId) {
    const res = await supabase
      .from("organization_contest")
      .select()
      .eq("organization_id", organizationId);
    data = res.data;
    error = res.error;
  }

  // Case 2: Only batchId is present
  if (batchId && !userId) {
    const batchRes = await supabase
      .from('batchxcontest')
      .select('contest_id')
      .eq('batch_id', batchId);
    if (batchRes.error) throw batchRes.error;

    const contestIds = batchRes.data.map(item => item.contest_id);
    const contestRes = await supabase
      .from('organization_contest')
      .select()
      .in('id', contestIds);

    data = contestRes.data;
    error = contestRes.error;
  }

  // Case 3: Only userId is present
  if (userId && !batchId) {
    const participantRes = await supabase
      .from('contestxparticipant')
      .select('contest_id')
      .eq('participant_id', userId);
    if (participantRes.error) throw participantRes.error;

    const contestIds = participantRes.data.map(item => item.contest_id);
    const contestRes = await supabase
      .from('organization_contest')
      .select()
      .in('id', contestIds);

    data = contestRes.data;
    error = contestRes.error;
  }

  // Case 4: Both batchId and userId are present
  if (batchId && userId) {
    const [batchRes, participantRes] = await Promise.all([
      supabase.from('batchxcontest').select('contest_id').eq('batch_id', batchId),
      supabase.from('contestxparticipant').select('contest_id').eq('participant_id', userId)
    ]);

    if (batchRes.error) throw batchRes.error;
    if (participantRes.error) throw participantRes.error;
    
    const batches=await supabase
      .from('organization_contest')
      .select()
      .in('id', batchRes.data.map(item => item.contest_id));

    for (const contest of batches.data) {
      contest.isEnrolled = participantRes.data.some(item => item.contest_id === contest.id);
    }
    data = batches.data;
    error = batches.error;
}
    


  if (error) throw error;
  return data;
};

export const enrollStudentToContestQuery = async (contestId, userId) => {
    const { data, error } = await supabase
        .from("contestxparticipant")
        .insert([{ contest_id: contestId, participant_id: userId ,status: 'enrolled'}])
        .select();

    if (error) throw error;
    return data;
}

  export const deleteContest = async (contestId) => {

    if (!contestId) throw new Error("constesId is required");

    const {data , error} = await supabase
    .from("organization_contest")
    .delete()
    .eq("id", contestId)
    .select()
    .maybeSingle();

    if (error) throw error;
  return data;
}

export const getContestCount=async(organizationId)=>{
    const { data, error } = await supabase
        .from("organization_contest")
        .select('*', { count: 'exact' , head: true })
        .eq("organization_id", organizationId);

    if (error) throw error;
    return data;
}

