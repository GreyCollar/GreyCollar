const { google } = require('googleapis');

const clientId = process.env.GDRIVE_CLIENT_ID;
const clientSecret = process.env.GDRIVE_CLIENT_SECRET;
const redirectUri = process.env.GDRIVE_REDIRECT_URI;
const refreshToken = process.env.GDRIVE_REFRESH_TOKEN || '1//03WcLLAuwVp24CgYIARAAGAMSNwF-L9Ir78hwtFCjLCouuHj-zfQmeULNRuh2NZGG4ZRvqEm8X052lVYiPq6Wd-zdXa2xChEJaHg';

async function testGDriveAuth() {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const res = await drive.files.list({
      pageSize: 5,
      fields: 'files(id, name, mimeType)',
    });
    console.log('Success! Files:');
    res.data.files.forEach(file => {
      console.log(`${file.id} ${file.name} (${file.mimeType})`);
    });
  } catch (err) {
    console.error('Google Drive API error:', err.message);
    if (err.response && err.response.data) {
      console.error('Details:', err.response.data);
    }
  }
}

testGDriveAuth(); 