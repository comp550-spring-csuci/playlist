const APPLE_MUSIC_DEVELOPER_TOKEN = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ikg2UDVLN1RGNFAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJCREhVQkpOVTlDIiwiaWF0IjoxNzQ1MjgzNDc0LCJleHAiOjE3NTA1Mzk0NzR9.4vx5venrU2HIsxTS5GoMksfVckabBQVnSgyXVLy49QgwWnNx-3ezc3oUxHsjkX2BWnh-iN1KuFGFXyqcs0hcQg';
const APPLE_MUSIC_API_URL = 'https://api.music.apple.com/v1/catalog/us'; // 'us' can be replaced with desired storefront

//recommendations requires user subscription to apple music
//get categories/generes
  //requires genre id,returns name of genre?
//ratings requires user subscription to apple music
//

// search for category resources
  //shows search for songs, can also search for:
    //activities, albums, apple-curators, artists, curators, music-videos, playlists, record-labels, stations
export async function searchAppleMusicSongs(query: string, limit: number = 10) {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${APPLE_MUSIC_API_URL}/search?term=${encodedQuery}&types=songs&limit=${limit}`, { //replace types=songs with albums or artists for differing results
        method: 'GET',headers: {Authorization: `Bearer ${APPLE_MUSIC_DEVELOPER_TOKEN}`,},});

    const searchData = await response.json();
    //console.log(data);
    return searchData.results?.songs?.data || [];
  }



export async function fetchAppleMusicCharts(type: string, limit: number = 10) {
    const response = await fetch(
        `${APPLE_MUSIC_API_URL}/charts?types=${type}&limit=${limit}`,{method: 'GET', headers: {Authorization: `Bearer ${APPLE_MUSIC_DEVELOPER_TOKEN}`,},});
      
    const chartData = await response.json();
    console.log('Chart data:', chartData);
  
    return chartData.results?.[type]?.[0]?.data || [];
   }

//get charts
  //albums, music-videos, playlists, songs



//