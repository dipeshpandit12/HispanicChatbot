export async function getFacebookUserData(accessToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/me?fields=id,email,name&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Facebook User Data Error:', error);
      throw new Error('Failed to fetch Facebook user data');
    }
  }
  
  export async function getFacebookPages(accessToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,access_token,followers_count,fan_count&access_token=${accessToken}`
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Facebook Pages Error:', error);
      throw new Error('Failed to fetch Facebook pages');
    }
  }
  
  export async function getInstagramBusinessAccount(accessToken, pageId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account{id,username}&access_token=${accessToken}`
      );
      const data = await response.json();
      return data.instagram_business_account || null;
    } catch (error) {
      console.error('Instagram Business Account Error:', error);
      throw new Error('Failed to fetch Instagram business account');
    }
  }
  
  export async function getInstagramInsights(accessToken, instagramAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${instagramAccountId}?fields=followers_count,media_count&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Instagram Insights Error:', error);
      throw new Error('Failed to fetch Instagram insights');
    }
  }
  
  export function isTokenExpired(expiresAt) {
    if (!expiresAt) return true;
    // Add 1 hour buffer before actual expiration
    return new Date(expiresAt).getTime() - 3600000 < Date.now();
  }
  
  export async function refreshFacebookToken(refreshToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
        `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&` +
        `fb_exchange_token=${refreshToken}`
      );
      
      const data = await response.json();
      if (!data.access_token) {
        throw new Error('No access token received');
      }
      
      return {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + (data.expires_in * 1000))
      };
    } catch (error) {
      console.error('Token Refresh Error:', error);
      throw new Error('Failed to refresh Facebook token');
    }
  }