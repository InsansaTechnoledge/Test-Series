const { Feature }= await import ("../../models/FirstDB/features.model.js")
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js"
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js"


export const createFeature = async (req, res) => {
  try {
    const body = req.body;
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return new APIError(400, 'Empty array provided').send(res);
      }

      const invalid = body.find((item) => !item.name);
      if (invalid) {
        return new APIError(400, 'Each feature must have a name').send(res);
      }

      const data = await Feature.insertMany(body, { ordered: false });
      return new APIResponse(200, data, 'Features created successfully').send(res);
    }

    // Handle single object insert
    if (!body.name) {
      return new APIError(400, 'Feature name is required').send(res);
    }

    const data = await Feature.create(body);
    return new APIResponse(200, data, 'Feature created successfully').send(res);
  } catch (err) {
    new APIError(
      err?.response?.status || err?.status || 500,
      ['Something went wrong while creating the feature', err.message || '']
    ).send(res);
  }
};


export const fetchAllFeatures = async(req,res) => {
    try{
        const data = await Feature.find().lean()

        if(!data || data.length === 0) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        return new APIResponse(200, data , 'all features fetched successfully').send(res);
    } catch(e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching all features", err.message || ""]).send(res);

    }
}

export const ToggleActiveOrInactive = async (req,res) => {
    try{

        const {id} = req.params

        const data = await Feature.findById(id)

        if(!data ) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        data.status = data.status === 'active' ? 'inactive' : 'active'

        await data.save();

        return new APIResponse(200 , data , `Feature has been set to ${data.status}`).send(res);

    } catch(e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while activating/in-activating the feature", err.message || ""]).send(res);
        
    }
}

export const updateFeature = async(req,res) => {
    try{

        const {id} = req.params

        const data = await Feature.findById(id)

        if(!data ) return new APIError(400, 'feature you are looking for , is either removed or does not exists').send(res);

        const update = req.body

        const updated = await Feature.findByIdAndUpdate(id , update , {new: true})

        return new APIResponse(200, updated , 'feature updated successfully').send(res)


    } catch(e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the feature", err.message || ""]).send(res);
        
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
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the feature", err.message || ""]).send(res);

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