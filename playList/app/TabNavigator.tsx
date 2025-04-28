import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard'; 
import Playlists from './screens/Playlists';
import Downloads from './screens/Downloads';
import UserProfile from './screens/UserProfile';

const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Dashboard}/>
        <Tab.Screen name="Playlists" component={Playlists}/>
        <Tab.Screen name="Downloads" component={Downloads}/>
        <Tab.Screen name="Profile" component={UserProfile}/>
      </Tab.Navigator>
);
}

export default TabNavigator;