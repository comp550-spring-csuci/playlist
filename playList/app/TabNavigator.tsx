import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard'; 
import Playlists from './screens/Playlists';
import Downloads from './screens/Downloads';
import UserProfile from './screens/UserProfile';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';



const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
      <Tab.Navigator screenOptions={{
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 0,
          elevation: 4
        }
      }}
      >
        <Tab.Screen 
          name="Home"
          component={Dashboard}
          options = {{
              tabBarLabel: "Home",
              headerShown: false,
              tabBarLabelStyle: {color: "white"},
              tabBarIcon: ({focused}) =>
                focused? (
                  <Entypo name="home" size={24} color="black" />
                ): (<AntDesign name="home" size={24} color="black" />) }} 
        />

        <Tab.Screen 
          name="Playlists" 
          component={Playlists}
          options = {{
            tabBarLabel: "Playlists",
            headerShown: false,
            tabBarLabelStyle: {color: "white"},
            tabBarIcon: ({focused}) =>
              focused? (
                <MaterialCommunityIcons name="playlist-music" size={24} color="black" />
              ): (<MaterialCommunityIcons name="playlist-music-outline" size={24} color="black" />) }}  
        />

        <Tab.Screen 
          name="Downloads" 
          component={Downloads}
          options = {{
            tabBarLabel: "Downloads",
            headerShown: false,
            tabBarLabelStyle: {color: "white"},
            tabBarIcon: ({focused}) =>
              focused? (
                <Ionicons name="download" size={24} color="black" />
              ): (<Ionicons name="download-outline" size={24} color="black" />) }} 
        />

        <Tab.Screen 
          name="Profile" 
          component={UserProfile}
           options = {{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarLabelStyle: {color: "white"},
            tabBarIcon: ({focused}) =>
              focused? (
                <Octicons name="person-fill" size={24} color="black" />
              ): (<Octicons name="person" size={24} color="black" />) }} 
        />





      </Tab.Navigator>
);
}

export default TabNavigator;