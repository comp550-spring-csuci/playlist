import React from "react";
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { styles } from "@/styles/style";

const Login = () => {
  const router = useRouter();

  const onLogin = () => {
    // router.navigate("/dashboard");
    router.navigate("/AppTabs");
  };

  const onSignUp = () => {
    router.navigate("/signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/headphones2.gif")} style= {styles.logoImage}/>
        {/*<Image source={require("@/assets/images/myicon.png")} />
        <Image source={require("@/assets/images/playlist-logo.png")}  />*/}
        <Text style={styles.title}>PlayList</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          onChangeText={(e) => console.log(e)}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(e) => console.log(e)}
        />
        <MyButton title="LOGIN" onPress={onLogin} />
      </View>
      <TouchableOpacity onPress={onSignUp}>
        <Text style={styles.signUpText}>Don't Have an Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Login;
