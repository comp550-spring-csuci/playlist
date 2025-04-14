import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "./dashboard"; // Import the Dashboard component
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";


const Tab = createBottomTabNavigator();

const BottomNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor:"rgba(247, 241, 241, 0.95)",
                position: "absolute",
                bottom:0,
                left:0,
                right:0,
                shadowOpacity:4,
                shadowRadius:4,
                elevation:4,
                shadowOffset:{
                    width:0,
                    height:-4
                },
                borderTopWidth:0
            }
        }}>
        

        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
                tabBarLabel: "Home", 
                headerShown: false, 
                tabBarLabelStyle: {color: "white"},
                tabBarIcon: ({focused}) =>
                    focused? (
                        <Entypo name="home" size={24} color="black" />
                    ): (<AntDesign name="home" size={24} color="black" />)
            }} 
            />

        <Tab.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{ 
                tabBarLabel: "Dashboard", 
                headerShown: false, 
                tabBarLabelStyle: {color: "white"},
                tabBarIcon: ({focused}) =>
                    focused? (
                        <MaterialCommunityIcons name="view-dashboard" size={24} color="black" />
                    ): (<MaterialCommunityIcons name="view-dashboard-outline" size={24} color="black" />)
        }} 
        />      
        
        <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
            tabBarLabel: "Profile", 
            headerShown: false, 
            tabBarLabelStyle: {color: "white"},
            tabBarIcon: ({focused}) =>
                focused? (
                    <Ionicons name="person" size={24} color="black" />
                ): (<Ionicons name="person-outline" size={24} color="black" />)
        }} 
        />
        </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigation;