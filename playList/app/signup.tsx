import { Text, View, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import MyButton from "@/components/MyButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase"; // ✅ make sure firebase.js is setup in services/
import { styles } from "@/styles/style";

const SignUp = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSignUp = async () => {
    if (!email || !password || !fullName || !phone) {
      setError("All fields are required");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
      router.navigate("/AppTabs");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onLogin = () => {
    router.navigate("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/headphones2.gif")} style={styles.logoImage} />
        <Text style={styles.title}>PlayList</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          onChangeText={setFullName}
          value={fullName}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          keyboardType="phone-pad"
        />
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
        <MyButton title="SIGN UP" onPress={onSignUp} />
      </View>

      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.signUpText}>Already Have an Account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;
