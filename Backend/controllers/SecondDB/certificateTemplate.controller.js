import CertificateTemplate from "../../models/SecondDB/certificate_templates.models.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js"
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const createTemplate = async (req, res) => {
    try{

        const {name , description , style} = req.body

        if(!req.file || !req.file.path) {
            return new APIError(400 , 'template image missing').send(res);
        }

        const Template = await CertificateTemplate.create({
            name,
            description,
            image: req.file.path,
            style
        })

        return new APIResponse(200 , Template , 'certificate template created successfully ').send(res);

    }catch (e) {
        return new APIError(500 , 'failed to create certificate template').send(res);
    }
}

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find({ is_global: true }).sort({ created_at: -1 });

   
    return new APIResponse(200, templates, 'Fetched all the templates successfully').send(res);
  } catch (e) {
    return new APIError(500, 'Failed to fetch all the certificate templates from server').send(res);
  }
};
