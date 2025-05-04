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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import login from './login';



const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
      <Tab.Navigator screenOptions={{
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          flex: 1
        },
        tabBarIconStyle: {
          alignSelf: 'center'
        }
      }}
      >
  

       
 
        <Tab.Screen 
          name="Home"
          component={Dashboard}
          options = {{
              
              tabBarActiveTintColor: 'black',  
              tabBarInactiveTintColor: 'black',
              headerShown: false,
              tabBarShowLabel: false,
              
              tabBarIcon: ({focused}) =>
                focused? (
                  <Entypo name="home" size={24} color="black" />
                ): (<AntDesign name="home" size={24} color="black" />) }} 
        />
    

        <Tab.Screen 
          name="Playlists" 
          component={Playlists}
          options = {{
            
            headerShown: false,
            tabBarActiveTintColor: 'black',  
            tabBarInactiveTintColor: 'black',
            tabBarShowLabel: false,
            
            tabBarIcon: ({focused}) =>
              focused? (
                <MaterialCommunityIcons name="playlist-music" size={24} color="black" />
              ): (<MaterialCommunityIcons name="playlist-music-outline" size={24} color="black" />) }}  
        />

        <Tab.Screen 
          name="Downloads" 
          component={Downloads}
          options = {{
            
            headerShown: false,
            tabBarActiveTintColor: 'black',  
            tabBarInactiveTintColor: 'black',
            tabBarShowLabel: false,
            
            tabBarIcon: ({focused}) =>
              focused? (
                <Ionicons name="download" size={24} color="black" />
              ): (<Ionicons name="download-outline" size={24} color="black" />) }} 
        />

       
        <Tab.Screen 
          name="Profile" 
          component={UserProfile}
           options = {{
            
            tabBarActiveTintColor: 'black',  
            tabBarInactiveTintColor: 'black',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused? (
                <Octicons name="person-fill" size={24} color="black" />
              ): (<Octicons name="person" size={24} color="black" />) }} 
        />




      </Tab.Navigator>
);
}

{/*}
const Stack = createNativeStackNavigator();

function Navigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={login} options={{headerShown:false}}/>
                <Stack.Screen name="Dashboard" component={TabNavigator} options={{headerShown:false}}/>
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

*/}

export default TabNavigator