const CLIENT_ID = '';
const CLIENT_SECRET = '';
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const PLAYLIST_ID = "3cEYpjA9oz9GiPac4AsH4n"; // Example playlist ID

// Function to get Spotify API Token
export async function getSpotifyToken() {
  try {
    console.log("Getting Spotify Token...");
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: "grant_type=client_credentials",
    });

    console.log("Token Response Status:", response.status);

    if (!response.ok) {
      console.error("Token Response Error:", response.statusText);
      return null; // Or throw an error
    }

    const data = await response.json();
    console.log("Token Data:", data);

    if (data && data.access_token) {
      console.log("Token Retrieved Successfully");
      return data.access_token;
    } else {
      console.error("Token Retrieval Failed: Invalid Response");
      return null;
    }
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return null;
  }
}

// Function to fetch songs from Spotify
export async function fetchSongs() {
  try {
    console.log("Fetching Songs...");
    const token = await getSpotifyToken();

    if (!token) {
      console.error("No token available. Unable to fetch songs.");
      return [];
    }

    console.log("Using Token:", token);

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Fetch Songs Response Status:", response.status);

    if (!response.ok) {
      console.error("Fetch Songs Response Error:", response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Fetch Songs Data:", data);
   if (data && data.tracks && data.tracks.items) {
        console.log("Songs Fetched Successfully");
        return data.tracks.items; // Extract song list
    } else {
        console.error("Songs Fetch Failed: Invalid Response");
        return [];
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

export async function fetchCategories() {
  //returns list of categories from Spotify API
  try {
    console.log("Getting Spotify Token")
    const token = await getSpotifyToken();
    
    if (!token) {
      console.error("No token available, unable to fetch categories")
      return[];
    }

    const response =  await fetch(
      `https://api.spotify.com/v1/browse/categories?country=US&limit=20`,
      {
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      }
    );
    if (!response.ok){
      console.error("Failure to fetch categories", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.categories.items;

  } catch (error) {
    console.error("Error encountered fetching categories", error);
    return [];
  }
}

export async function fetchCategoricalPlaylist(category:string) {
  //returns playlists based off of an input category as shown in categories.tsx
  //needs update in case of categories that contain '/' in them such as 'Dance/Electronic'
    //can have pathway be id instead, need to maintain 
  
  try {
    console.log("Getting Spotify Token")
    const token = await getSpotifyToken();
    if (!token) {
      console.error("No token available, unable to fetch playlists")
      return[];
    }


    console.log("Category requested:", category);

    const response = await fetch(`https://api.spotify.com/v1/search?q=${category}&type=playlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok){
      console.error("Failure to fetch playlists", response.status);
      return [];
    }
    
    const data = await response.json();
    console.log("received item search", data)

    //filters out nullobjects from data before returning playlist, null objects break [id].tsx
    const playlists = data.playlists?.items?.filter((item: any) => item !== null) || [];
    return playlists;
    
  }  catch (error) {
  console.error("error fetching playlists", error);
  return [];
  }
}

export async function fetchRelatedArtistTracks(trackId: string){
  try{
    console.log("Getting Spotify Token")
    const token = await getSpotifyToken();
    if (!token) {
      console.error('token unavailable')
      return[];
    }
    trackId = "11dFghVXANMlKmJXsNCbNl" //hardcoded track id
    console.log("Song ID: ", trackId)

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok){
      console.error('failed to find song', response.status);
      return[];
    }

    const data = await response.json();
    console.log('track artist: ', data.artists[0].id); //shows artist id based on provided track


    //pulls top tracks from identified artist
    const responseTracks = await fetch(`https://api.spotify.com/v1/artists/${data.artists[0].id}/top-tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });    
    const artistTracks = await responseTracks.json();
    
    console.log(artistTracks.tracks[0].name); //displays top track by artist
    
    return artistTracks.tracks;

  }

  catch (error){
    console.error(error);
    return[];
  }

}

