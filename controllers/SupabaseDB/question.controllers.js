import { APIError } from "../../utils/ResponseAndError/ApiError.utils";

export const updateQuestion = async (req, res) => {
    try{

    }
    catch(err){
        console.log(err);
        return new APIError(500, ["Something went wrong while updating question", err.message]).send(res);
    }
}