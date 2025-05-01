import React from "react";
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { styles } from "@/styles/style";
import Entypo from '@expo/vector-icons/Entypo';

const Login = () => {
  const router = useRouter();

  const onLogin = () => {
    router.navigate("/AppTabs");
  };

  const onSignUp = () => {
    router.navigate("/signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/myicon.png")} />
        {/*<Image source={require("@/assets/images/playlist-logo.png")}  />*/}
        <Text style={styles.title}>PlayList</Text>
      </View>
      <View style={styles.formContainer}>
        
        <MyButton title="Login with Spotify" onPress={onLogin} />

       
        <Pressable
          onPress={onLogin}
          style={{
            backgroundColor: "#1DB954",
            paddingHorizontal: 60,
            paddingVertical: 15,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection:"row"
          }}
        >
        <Text style={{ fontSize: 16, color: "white", marginRight: 8}}>Login with Spotify</Text>
        <Entypo name="spotify" size={24} color="black" />
        </Pressable>



        
      </View>
      <TouchableOpacity onPress={onSignUp}>
        <Text style={styles.signUpText}>Don't Have an Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Login;
