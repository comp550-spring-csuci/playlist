import React from 'react';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
// import React from 'react';
// import { Button } from 'react-native';
// import useSpotifyAuth from '.src/utils/auth';  // import the custom hook

// export default function App() {
//   const { request, promptAsync } = useSpotifyAuth();

//   return (
//     <Button
//       title="Login with Spotify"
//       onPress={() => promptAsync()}  // Start the authentication flow
//     />
//   );
// }

