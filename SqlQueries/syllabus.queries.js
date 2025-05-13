import  {getSupabaseClient} from '../database/SupabaseDB.js';
import { APIError } from '../utils/ResponseAndError/ApiError.utils.js';
import { APIResponse } from '../utils/ResponseAndError/ApiResponse.utils.js';

const supabase= getSupabaseClient();

export const createSyllabus = async (syllabusData) => {
    try{
        
const { data, error } = await supabase
  .from('batch_syllabus')
  .insert({ syllabusData })
  .select();

     if (error) {
      console.error("Supabase error:", error);
      return new APIError(400, ["Failed to insert syllabus", error.message]).send(res);
    }

    new APIResponse(200, ["Syllabus created successfully!!"], data).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while creating syllabus in supabase query", err.message || ""]).send(res);
    }
};

export const getSyllabus = async () => {
    try{
        const { data, error } = await supabase
  .from('batch_syllabus')
  .select('*');

     if (error) {
      console.error("Supabase error:", error);
      return new APIError(400, ["Failed to fetch syllabus", error.message]).send(res);
    }

    new APIResponse(200, ["Syllabus fetched successfully!!"], data).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching syllabus in supabase query", err.message || ""]).send(res);
    }
};

export const updateSyllabus = async (syllabusData,syllabusId) => {
    try{
        const { data, error } = await supabase
  .from('batch_syllabus')
  .update(syllabusData)
  .eq('id', syllabusId)
  .select();

     if (error) {
      console.error("Supabase error:", error);
      return new APIError(400, ["Failed to update syllabus", error.message]).send(res);
    }

    new APIResponse(200, ["Syllabus updated successfully!!"], data).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating syllabus in supabase query", err.message || ""]).send(res);
    }
};

export const deleteSyllabus = async (syllabusId) => {
    try{
        const { data, error } = await supabase
  .from('batch_syllabus')
  .delete()
  .eq('id', syllabusId)
  .select();

     if (error) {
      console.error("Supabase error:", error);
      return new APIError(400, ["Failed to delete syllabus", error.message]).send(res);
    }

    new APIResponse(200, ["Syllabus deleted successfully!!"], data).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting syllabus in supabase query", err.message || ""]).send(res);
    }
};