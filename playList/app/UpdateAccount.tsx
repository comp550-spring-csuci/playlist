import { Text, View, Image, TextInput, TouchableOpacity, Alert} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import MyButton from "@/components/MyButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { styles } from "@/styles/style";
import { auth, db } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const UpdateAccount = () => {

  const router = useRouter();

  //for initial name, phone, email viewing and updating
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  //fetch user data 
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          //user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFullName(data.fullName);
            setPhone(data.phone);
            setEmail(user.email || "");
            setInitialEmail(user.email || "");
          }
        } catch (err) {
          setError("Failed to load user data");
        }
      }
    };

    fetchUserData();
  }, []);

  //when save button is pressed
  const onSave = async () => {
    const user = auth.currentUser;
    if (!user || !email || !fullName || !phone) {
      setError("All fields are required");
      return;
    }

    try {
      //update email in Firebase Auth if it is changed 
      if (email !== initialEmail) {
        const credential = EmailAuthProvider.credential(user.email!, prompt("Please enter your password again to update your email:") || "");
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email);
      }

      //update Firestore with user input
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        phone,
      });

      setError("");
      //go back to user profile
      router.push("/UserProfile");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    //styling 

    <View style={styles.container}>

      {/* X button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.push("/UserProfile")}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={require("@/assets/images/headphones2.gif")} style={styles.logoImage} />
        <Text style={styles.title}>Update Account</Text>
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

        {error !== "" && (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        )}
        <MyButton title="SAVE" onPress={onSave} />
      </View>
 
    </View>
  );
};

export default UpdateAccount;