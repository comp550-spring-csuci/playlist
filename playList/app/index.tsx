import * as React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton"
//import { styles } from "@/styles/style";





export default function Index() {

  const router = useRouter();
  const getStarted = () => {
      router.navigate("/login");

  }

  return (
    <View style={styles.indexContainer}>
      
        {/*<Text style={styles.title}>PlayList</Text>*/}
        <View style={styles.imageContainer}>
          <Image source={require("@/assets/images/myicon.png")} />
          <Image source={require("@/assets/images/playlist-logo.png")} style={styles.image} />
        </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome to PlayList</Text>
        <Text style={styles.description}>Your music. Your mood. Your PlayList.{"\n"}
        Explore songs, podcasts, audiobooks, and videos come together seamlessly —
        all in one beautifully personalized experience.{"\n"}PlayList is your all-in-one media companion.</Text>
        <MyButton title="GET STARTED" onPress={getStarted} />
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
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
)