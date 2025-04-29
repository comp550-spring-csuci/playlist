import * as React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton"
import { styles } from "@/styles/style";
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

export default function Index() {

  const router = useRouter();
  const getStarted = () => {
      router.navigate("/login");
  }

  return (
    <View style={styles.indexContainer}>

        {/*<View style={styles.imageContainer}>*/}
        <View>
          <Image source={require("@/assets/images/myicon.png")} />
          <Text style={styles.title}>PlayList</Text>
          {/*<Image source={require("@/assets/images/playlist-logo.png")} style={styles.image} />*/}
        </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome to PlayList</Text>
        <Text style={styles.description}>Your music. Your mood. Your PlayList.{"\n"}
        Discover songs, podcasts, audiobooks, and videos — all in one beautifully integrated multimedia companion.</Text>
        <MyButton title="GET STARTED" onPress={getStarted} />
      </View> 
    </View>
  );
}

/*const styles = StyleSheet.create({
  indexContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain'
  },

  title: {
    textAlign: 'center'
  },

    formContainer: {
      alignItems: 'center'
    },
  
    welcomeText: {
      textAlign: 'center'
    },

    description: {
      textAlign: 'center'
    }
  }
)*/