import {google} from 'googleapis';
import fs from 'fs';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);

// Set the refresh token here
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN });

// YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadToYouTube = async (filePath, title, description) => {
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
