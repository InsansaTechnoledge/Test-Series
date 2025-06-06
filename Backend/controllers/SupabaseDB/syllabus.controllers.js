import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { createSyllabus ,updateSyllabus,deleteSyllabus , getSyllabusById} from "../../utils/SqlQueries/syllabus.queries.js";

export const AddSyllabus = async (req, res) => {
    const syllabusData = req.body;
    try{
        const data={
            syllabus:syllabusData,
            created_at: new Date()
        }
        const createdSyllabus = await createSyllabus(data);
        return new APIResponse(200, ["Syllabus created successfully!!"], createdSyllabus).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while creating syllabus", err.message || ""]).send(res);
    }

};

export const getSyllabusData = async (req, res) => {
    try{
        const syllabusData = await getSyllabus();
        return new APIResponse(200, ["Syllabus fetched successfully!!"], syllabusData).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching syllabus", err.message || ""]).send(res);
    }

};

export const fetchSyllabusById = async (req, res) => {
    try {
      const { id } = req.params; // syllabus ID from route param
  
      if (!id) {
        return new APIError(400, ['Syllabus ID is required']).send(res);
      }
  
      const syllabus = await getSyllabusById(id);
  
      if (!syllabus) {
        return new APIError(404, ['Syllabus not found']).send(res);
      }
  
      return new APIResponse(200, syllabus, 'Syllabus fetched successfully!').send(res);
    } catch (err) {
      console.error('❌ Error fetching syllabus:', err);
      return new APIError(
        err?.status || 500,
        ['Something went wrong while fetching the syllabus', err?.message]
      ).send(res);
    }
  };

export const updateSyllabusData = async (req, res) => {
    const syllabusData= req.body;
    try{
        const syllabusId = req.params.id;
        if(!syllabusId){
            return new APIError(400, ["Syllabus ID is required"]).send(res);
        };
        const data={
            syllabus:syllabusData,
            updated_at: new Date(),
            updated_by: req.user._id
        }
        const updatedSyllabus = await updateSyllabus(data,syllabusId);
        return new APIResponse(200, ["Syllabus updated successfully!!"], updatedSyllabus).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating syllabus", err.message || ""]).send(res);
    }

};

export const deleteSyllabusData = async (req, res) => {
    const syllabusId = req.params.id;
    try{
        if(!syllabusId){
            return new APIError(400, ["Syllabus ID is required"]).send(res);
        };
        const deletedSyllabus = await deleteSyllabus(syllabusId);
        return new APIResponse(200, ["Syllabus deleted successfully!!"], deletedSyllabus).send(res);

    }catch(err){
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting syllabus", err.message || ""]).send(res);
    }

};

