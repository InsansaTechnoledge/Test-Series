import { google } from "googleapis";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { addVideoIdToBatch } from "../../utils/SqlQueries/batch.queries.js";
import { getOauthClient, uploadToYouTube } from "../../utils/Youtube/uploadVideoUtil.js";
import User from "../../models/FirstDB/user.model.js";
import { Organization } from "../../models/FirstDB/organization.model.js";

export const register = async (req, res) => {
  try {
    const SCOPES = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.upload"
    ];

    const oauth2Client = await getOauthClient();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });

    console.log("Generated auth URL:", authUrl);
    return new APIResponse(200, authUrl).send(res);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return new APIError(500, ["Failed to generate Google auth URL"]).send(res);
  }
};

export const callback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return new APIError(400, ["Authorization code is missing"]).send(res);

    const oauth2Client = await getOauthClient();
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI,
    });

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    const userData = {
      user: {
        googleId: profile.id,
        email: profile.email,
        name: profile.name,
        profilePhoto: profile.picture,
      },
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiry: tokens.expiry_date,
      }
    };

    console.log("Fetched user data from Google:", userData);

    const savedUser = await saveUserData(userData, req.user._id, req.user.role);

    return new APIResponse(200, savedUser, ["User authenticated successfully!"]).send(res);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    return new APIError(500, [error.message || "Google OAuth callback failed"]).send(res);
  }
};


const saveUserData = async (userData, userId, role) => {
  try {
    const update = { $set: { youtubeInfo: userData } };

    const updatedUser =
      role === "organization"
        ? await Organization.findByIdAndUpdate(userId, update, { new: true })
        : await User.findByIdAndUpdate(userId, update, { new: true });

    console.log("YouTube info saved to DB:", updatedUser);
    return updatedUser;
  } catch (err) {
    console.error("Error saving user data:", err);
    throw new Error("Failed to save YouTube data to DB");
  }
};


export const uploadVideo = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { title, description , batchId} = req.body;

    
    // const batchId = "d894fdf4-94f6-4f51-b070-46bbba57a86d";

    const videoId = await uploadToYouTube(filePath, title, description, req.user);
    if (!videoId) {
      return new APIResponse(200, { message: "Video URL not found" }).send(res);
    }

    await addVideoIdToBatch(batchId, videoId);

    return new APIResponse(200, {
      message: "Video uploaded successfully",
      videoId
    }).send(res);
  } catch (err) {
    console.error("Video upload error:", err);
    return new APIError(500, [err.message, "Something went wrong during video upload"]).send(res);
  }
};
