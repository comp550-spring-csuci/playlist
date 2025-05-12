import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { styles } from "@/styles/style";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      router.navigate("/AppTabs");
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const onSignUp = () => {
    router.navigate("/signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/headphones2.gif")} style={styles.logoImage} />
        <Text style={styles.title}>PlayList</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        {error !== "" && (
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
              )}
        <MyButton title="LOGIN" onPress={onLogin} />
      </View>
      <TouchableOpacity onPress={onSignUp}>
        <Text style={styles.signUpText}>Don't Have an Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
