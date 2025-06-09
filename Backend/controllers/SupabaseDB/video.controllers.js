import { google } from "googleapis";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js"
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { addVideoIdToBatch } from "../../utils/SqlQueries/batch.queries.js";
import { getOauthClient, uploadToYouTube } from "../../utils/Youtube/uploadVideoUtil.js";
import User from "../../models/FirstDB/user.model.js";

export const register = async (req, res) => {
  const SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/youtube.upload"
  ];


  SCOPES.push();
  const oauth2Client=await getOauthClient();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  console.log("Generated auth URL:", authUrl);  

  return new APIResponse(200, authUrl).send(res);
}

export const callback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }
    const oauth2Client = await getOauthClient();

    const { tokens } = await oauth2Client.getToken({code,
      redirect_uri:process.env.OAUTH_REDIRECT_URI});
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    const userData = {
      user: {
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        profilePhoto: userInfo.data.picture,
      },
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiry: tokens.expiry_date,
      }
    }

    console.log("User data received:", userData);

    const user = await SaveUserData(userData, req.user._id);

    return new APIResponse(200, user, ["user authenticated succesfully!!"]).send(res);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
}

const SaveUserData = async (userData, userId) => {
  const SavedUser = await User.findByIdAndUpdate(
     userId ,
    {
      $set: {
        youtubeInfo: userData
      }
    },
    { new: true }
  );
  console.log("User data saved:", SavedUser);
  return SavedUser;
}



export const uploadVideo = async (req, res) => {
    try {
        const filePath = req.file.path;
        const { title, description } = req.body;

        const batchId = "d894fdf4-94f6-4f51-b070-46bbba57a86d";

        const videoId = await uploadToYouTube(filePath, title, description,req.user._id);

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

