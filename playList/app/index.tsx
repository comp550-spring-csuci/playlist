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
        <View style={styles.container}>

          <Image 
            source={require("@/assets/images/headphones.gif")}
            style= {styles.firstImage} 
          />

          <Text style={styles.welcomeText}>Welcome to</Text>


          <Image 
            source={require("@/assets/images/playlist-logo.png")} 
            style={styles.secondImage} />
        </View>
      
      <View style={styles.formContainer}>
        {/*<Text style={styles.welcomeText}>Welcome to PlayList</Text>*/}
        <Text style={styles.description}>Your music. Your mood. Your PlayList.{"\n"}
        Explore songs, podcasts, audiobooks, and videos come together seamlessly —
        all in one beautifully personalized experience.{"\n"}PlayList is your all-in-one media companion.</Text>
        <View style = {styles.buttonContainer}>
          <MyButton title="GET STARTED" onPress={getStarted} />
        </View>
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

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  firstImage: {
    width: 250,
    height: 250,
    marginBottom: 20
  },

  secondImage: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginTop: 10
  },

  title: {
    textAlign: 'center'
  },

    formContainer: {
      alignItems: 'center'
    },
  
    buttonContainer: {
      marginTop: 30
    },

    welcomeText: {
      textAlign: 'center',
      marginBottom: 5
    },

    description: {
      textAlign: 'center'
    }
  }
)