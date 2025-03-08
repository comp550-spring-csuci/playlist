import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PlaylistScreen from '../screens/PlaylistScreen';
import SongSearchScreen from '../screens/SongSearchScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Playlists">
      <Stack.Screen name="Playlists" component={PlaylistScreen} />
      <Stack.Screen name="SongSearch" component={SongSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
