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
       {/*} <Text style={styles.welcomeText}>Welcome to PlayList</Text>
        <Text style={styles.description}>Lorem ipsum is a dummy or placeholder text commonly used
        in graphic design, publishing, and web development to fill empty spaces in a layout that
        does not yet have content.</Text> */}
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