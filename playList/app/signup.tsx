import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import MyButton from "@/components/MyButton"
import { styles } from "@/styles/style";

const SignUp = () => {

   const router = useRouter();
   const onSignUp = () => {
       router.navigate("/dashboard");
   }
   const onLogin = () => {
          router.navigate("/login");
        };

   return (
       <View style={styles.container}>
         <View style={styles.header}>
           <Image source={require("@/assets/images/myicon.png")} />
           <Text style={styles.title}>PlayList</Text>
         </View>
         <View style={styles.formContainer}>
            <TextInput
               placeholder="Full Name"
               style={styles.input}
               onChangeText={(e) => console.log(e)}
            />
            <TextInput
                placeholder="Phone Number"
                style={styles.input}
                onChangeText={(e) => console.log(e)}
            />
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
            <MyButton title="SIGN UP" onPress={onSignUp} />
       </View>
       <TouchableOpacity onPress={onLogin}>
          <Text style={styles.signUpText}>Already Have an Account? Login</Text>
        </TouchableOpacity>
     </View>
   );
};

export default SignUp;
