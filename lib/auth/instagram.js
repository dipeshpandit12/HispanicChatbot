export async function getInstagramProfile(accessToken, instagramAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${instagramAccountId}?fields=username,profile_picture_url,website,biography&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Instagram Profile Error:', error);
      throw new Error('Failed to fetch Instagram profile');
    }
  }
  
  export async function getInstagramMediaInsights(accessToken, instagramAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Instagram Media Insights Error:', error);
      throw new Error('Failed to fetch Instagram media insights');
    }
  }
  
  export async function getInstagramStories(accessToken, instagramAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/stories?fields=id,media_type,media_url&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Instagram Stories Error:', error);
      throw new Error('Failed to fetch Instagram stories');
    }
  }
  
  export async function getInstagramAccountMetrics(accessToken, instagramAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${instagramAccountId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Instagram Metrics Error:', error);
      throw new Error('Failed to fetch Instagram metrics');
    }
  }