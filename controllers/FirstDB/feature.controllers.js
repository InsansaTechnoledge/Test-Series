const { Feature }= await import ("../../models/FirstDB/features.model.js")
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js"
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js"


export const createFeature = async (req,res) => {
    try{
        const body = req.body

        if(!body.name) return new APIError(404, 'feature name is required').send(res)

        const data = await Feature.create(body)

        return new APIResponse(200, data , 'feature created successfully').send(res)
    } catch(e) {
        return new APIError(500, ['something went wrong while creating features', e.message]).send(res);
    }
}

export const fetchAllFeatures = async(req,res) => {
    try{
        const data = await Feature.find().lean()

        if(!data || data.length === 0) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        return new APIResponse(200, data.toResponse() , 'all features fetched successfully').send(res);
    } catch(e) {
        return new APIError(500 , ['soomething went wrong while fetching all features' , e.message]).send(res)
    }
}

export const ToggleActiveOrInactive = async (req,res) => {
    try{

        const {id} = req.params

        const data = await Feature.findById(id)

        if(!data ) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        data.status = data.status === 'active' ? 'inactive' : 'active'

        await data.save();

        return new APIResponse(200 , data.toResponse() , `Feature has been set to ${data.status}`).send(res);

    } catch(e) {
        return new APIError(500, ['something went wrong while activating/in-activating the feature' , e.message]).send(res)
    }
}

export const updateFeature = async(req,res) => {
    try{

        const {id} = req.params

        const data = await Feature.findById(id)

        if(!data ) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        const update = req.body

        const updated = await Feature.findByIdAndUpdate(id , update , {new: true})

        return new APIResponse(200, updated.toResponse() , 'feature updated successfully').send(res)


    } catch(e) {
        return new APIError(500, ['something went wrong while updating the feature' , e.message]).send(res);
    }
}

export const deleteFeature = async(req , res) => {
    try{

        const {id} = req.params

        const data = await Feature.findById(id)

        if(!data ) return new APIError(400, 'feature you are looking for , is already deleted').send(res);

        await Feature.findByIdAndDelete(id)

        return new APIResponse(200, null, 'feature deleted successfully').send(res)

    } catch (e) {
        return new APIError(500 , ['something went wrong while deleting' , e.message]).send(res)
    }
}

// export const fetchAllInactivateFeatures = async (req,res) => {
//     try{

//         const data = await Feature.find({status: 'inactive'})

//         if(!data || data.length === 0) return APIError(400, 'no inactive features available').send(res);

//         return APIResponse(200, data , 'all Inactive features fetched successfully').send(res);

//     } catch{
//         return APIError(500, ['something went wrong while fetching all Inactivat feature or while activating it ' , e.message]).send(res)
//     }
// }