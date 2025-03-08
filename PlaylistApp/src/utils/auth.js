import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

const CLIENT_ID = 'f51876df31574ec0a9d6dc8f697da314';
const REDIRECT_URI = makeRedirectUri({ useProxy: true });

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const useSpotifyAuth = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['playlist-modify-public', 'playlist-modify-private'],
      usePKCE: true,
    },
    { authorizationEndpoint: AUTH_URL, tokenEndpoint: TOKEN_URL }
  );

  // Handle the response and get the access token
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      // Store access token securely for API requests
      console.log('Spotify Access Token:', access_token);
    }
  }, [response]);

  return {
    request,
    promptAsync,
  };
};

export default useSpotifyAuth;
