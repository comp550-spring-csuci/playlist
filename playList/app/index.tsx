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
        <Text style={styles.description}>Your music. Your mood. Your PlayList.{"\n"}
        Explore songs, podcasts, audiobooks, and videos come together seamlessly —
        all in one beautifully personalized experience.{"\n"}PlayList is your all-in-one media companion.</Text>
        <MyButton title="GET STARTED" onPress={getStarted} />
      </View>
    </View>
  );
}
