import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Dashboard from './dashboard';

const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Dashboard" component={Dashboard}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
        <Tab.Screen name="Settings" component={SettingsScreen}/>
      </Tab.Navigator>
);
}

export default TabNavigator;