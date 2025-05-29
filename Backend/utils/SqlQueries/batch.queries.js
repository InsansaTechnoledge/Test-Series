import { getSupabaseClient } from "../../database/SupabaseDB.js";

const supabase = getSupabaseClient();

export const CreateOrganizationBatch = async (batchData) => {
  const { data, error } = await supabase
    .from('organization_batch')
    .insert(batchData)
    .select()

  if (error) {
    throw error;
  }
  return data;
}

export const getOrganizationBacthes = async ({ id, organization_id, year }) => {
  let query = supabase.from('organization_batch').select('*');

  if (id && Array.isArray(id)) {
    query = query.in('id', id);
  }

  if (organization_id) query = query.eq('organization_id', organization_id);
  if (year) query = query.eq('year', year);

  query = query.order('created_at', { ascending: false });


  const { data, error } = await query;
  if (error) throw error;
  return data;
};


export const updateOrganizationBatch = async (id, updates) => {
  const { data, error } = await supabase
    .from('organization_batch')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteOrganizationBatch = async (id) => {
  const { data, error } = await supabase
    .from('organization_batch')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addVideoIdToBatch = async (batchId, videoId) => {
  const { data, error } = await supabase.rpc('append_video_id', {
    batch_id: batchId,
    new_video_id: videoId,
  });

  if(error) throw error;
  return data;
}