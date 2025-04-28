import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './dashboard'; 
import Playlists from './screens/Playlists';
import Downloads from './screens/Downloads';
import UserProfile from './screens/UserProfile';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

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

        <Tab.Screen name="Playlists" component={Playlists}/>
        <Tab.Screen name="Downloads" component={Downloads}/>
        <Tab.Screen name="Profile" component={UserProfile}/>
      </Tab.Navigator>
);
}

export default TabNavigator;