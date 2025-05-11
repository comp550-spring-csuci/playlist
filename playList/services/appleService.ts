const APPLE_MUSIC_DEVELOPER_TOKEN = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ikg2UDVLN1RGNFAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJCREhVQkpOVTlDIiwiaWF0IjoxNzQ1MjgzNDc0LCJleHAiOjE3NTA1Mzk0NzR9.4vx5venrU2HIsxTS5GoMksfVckabBQVnSgyXVLy49QgwWnNx-3ezc3oUxHsjkX2BWnh-iN1KuFGFXyqcs0hcQg';
const APPLE_MUSIC_API_URL = 'https://api.music.apple.com/v1/catalog/us'; // 'us' can be replaced with desired storefront

// Search songs on Apple Music
export async function searchAppleMusicSongs(query: string, limit: number = 10) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${APPLE_MUSIC_API_URL}/search?term=${encodedQuery}&types=songs&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APPLE_MUSIC_DEVELOPER_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Apple Music search failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data.results?.songs?.data || [];
  } catch (error) {
    console.error('Apple Music search error:', error);
    return null;
  }
}


export async function getAppleRecommendations(query:string, limit:number=10) {
    const encodedId = encodeURIComponent("1443147095");
    const response = await fetch(`https://api.music.apple.com/v1/me/recommendations/${encodedId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${APPLE_MUSIC_DEVELOPER_TOKEN}`,
        },
    });
    const data = await response.json();
    return data;
}