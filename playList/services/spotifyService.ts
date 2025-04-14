const CLIENT_ID = '5151f9c710d94ed3bcb85a48bd0ec706';
const CLIENT_SECRET = 'cc6362cb14014cce81d7d4e555185b6b';
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