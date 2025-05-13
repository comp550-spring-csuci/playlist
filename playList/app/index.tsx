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
        <View>
          <Image
            source={require("@/assets/images/headphones2.gif")}
            style={styles.logoImage}
          />
          <Text style={styles.title}>PlayList</Text>
        </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome to PlayList</Text>
        <Text style={styles.description}>Your music. Your mood. Your PlayList.{"\n"}
        Discover songs, podcasts, audiobooks, and videos — all in one beautifully integrated multimedia companion.</Text>
        <View style={styles.buttonContainer}>
          <MyButton title="GET STARTED" onPress={getStarted} />
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
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
    width: 200,
    height: 200
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
})