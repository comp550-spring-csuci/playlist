// LoginComponent.tsx
import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { styles } from "@/styles/style";

const Login = () => {
  const router = useRouter();

  const onLogin = () => {
    router.navigate("/dashboard");
  };

  const onSignUp = () => {
    router.navigate("/signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/myicon.png")} />
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
