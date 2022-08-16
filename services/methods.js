const axios = require('axios');
const qs = require('query-string');
require('dotenv').config();

const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile ='https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';

async function getAccessToken(code, redirect_uri) {
    let accessToken = null;
    const config = {
      headers: { "Content-Type": 'application/x-www-form-urlencoded' }
    };

    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code');
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("client_id", process.env.LINKEDIN_CLIENT_ID);
    params.append("client_secret", process.env.LINKEDIN_CLIENT_SECRET);

    try {
        const response = await axios.post(urlToGetLinkedInAccessToken, params, config);
        accessToken = response.data["access_token"];
    }
    catch(err) {
        console.log(err);
    }

    return accessToken;
  }
  

async function getUserProfile(accessToken) {
    let userProfile = null;
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }
    
    try {
        const { data } = await axios.get(urlToGetUserProfile, config);
        if(data["localizedFirstName"] && data["localizedLastName"]) userProfile = {};
        userProfile.firstName = data["localizedFirstName"];
        userProfile.lastName = data["localizedLastName"];
    }
    catch(err) {
        console.log(err);
    }
    return userProfile;
}
  
  
async function getUserEmail(accessToken) {
    let email = null;
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };

    try {
        const response = await axios.get(urlToGetUserEmail, config);
        email = response.data.elements[0]["handle~"].emailAddress;
    }
    catch(err) {
        console.log(err);
    }
    return email;
}

module.exports = {
    getAccessToken,
    getUserEmail,
    getUserProfile
}