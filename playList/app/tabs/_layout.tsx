import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => 
            focused?(
                <Entypo name="home" size={24} color="black" />
            ): (<AntDesign name="home" size={24} color="black" />)
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => 
            focused? (
                <Ionicons name="person" size={24} color="black" />
            ): (<Ionicons name="person-outline" size={24} color="black" />)
        }}
      />
    </Tabs>
  );
}
