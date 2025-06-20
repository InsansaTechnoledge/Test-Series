import { google } from 'googleapis';
import fs from 'fs';

// Initialize OAuth2 client

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);

export const getOauthClient = async () => {
  return oauth2Client;
}

// Set the refresh token here
// oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN });


//checking for token expiry
export const isTokenExpired = async (expiry) => {
  const currentTime = Date.now();
  return currentTime > expiry;
}

//get new tokens from refresh token
export const getNewTokens = async (refreshToken) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

//update new tokens
export const updateTokens = async (account) => {
  try {
    const credentials = await getNewTokens(account.tokens.refreshToken);

    const { access_token, refresh_token, expiry_date } = credentials;

    account.tokens.accessToken = access_token;
    account.tokens.refreshToken = refresh_token;
    account.tokens.expiry = expiry_date;

    await account.save();
    return credentials;
  }
  catch (err) {
    console.log("Refrehing token error: ", err);
  }
}

// YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadToYouTube = async (filePath, title, description, user) => {

  const isExpired = await isTokenExpired(user.youtubeInfo.tokens.expiry);
  if (isExpired) {
    await updateTokens(user);
  }

  oauth2Client.setCredentials(
    { refresh_token: user.youtubeInfo.tokens.refreshToken }
  )

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title || 'Untitled Upload',
        description: description || '',
        categoryId: '22',
      },
      status: {
        privacyStatus: 'unlisted',
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });

  fs.unlinkSync(filePath); // Cleanup
  return response.data.id;
}
