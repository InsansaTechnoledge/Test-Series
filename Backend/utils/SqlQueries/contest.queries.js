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

export const fetchContest = async (organizationId) => {
    if (!organizationId) throw new Error("organizationId is required");
  
    const { data, error } = await supabase
      .from("organization_contest")
      .select()
      .eq("organization_id", organizationId);
  
    if (error) throw error;
    return data;
  };

