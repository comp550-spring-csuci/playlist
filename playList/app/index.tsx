import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton"
import { styles } from "@/styles/style";

export default function Index() {

  const router = useRouter();
  const getStarted = () => {
      router.navigate("/login");

  }

  return (
    <View style={styles.indexContainer}>
      <View>
        <Image source={require("@/assets/images/myicon.png")} />
        <Text style={styles.title}>PlayList</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome to PlayList</Text>
        <Text style={styles.description}>Lorem ipsum is a dummy or placeholder text commonly used
        in graphic design, publishing, and web development to fill empty spaces in a layout that
        does not yet have content.</Text>
        <MyButton title="GET STARTED" onPress={getStarted} />
      </View>
    </View>
  );
}
