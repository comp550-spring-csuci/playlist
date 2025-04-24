import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard'; 
import PlaylistScreen from './screens/PlaylistScreen';
import DownloadsScreen from './screens/DownloadsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Dashboard}/>
        <Tab.Screen name="Playlists" component={PlaylistScreen}/>
        <Tab.Screen name="Downloads" component={DownloadsScreen}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
      </Tab.Navigator>
);
}

export default TabNavigator;