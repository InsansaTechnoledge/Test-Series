import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js"
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { addVideoIdToBatch } from "../../utils/SqlQueries/batch.queries.js";
import { uploadToYouTube } from "../../utils/Youtube/uploadVideoUtil.js";

export const uploadVideo = async (req, res) => {
    try {
        const filePath = req.file.path;
        const { title, description } = req.body;

        const batchId = "d894fdf4-94f6-4f51-b070-46bbba57a86d";

        const videoId = await uploadToYouTube(filePath, title, description);

        await addVideoIdToBatch(batchId, videoId);
        
        if(videoId){
            return new APIResponse(200, {message: "Video uploaded", videoId}).send(res);
        }
        else{
            return new APIResponse(200, {message: "Video url not found"}).send(res);
        }
    }
    catch (err) {
        console.log(err);
        return new APIError(500, [err.message, "Something went wrong while uploading video"]).send(res);
    }
}