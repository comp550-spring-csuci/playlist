import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton"

const GetStarted = () => {

  const router = useRouter();
  const getStarted = () => {
      router.navigate("/login");

  }

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Image
          source={require("@/assets/images/myicon.png")}
          style={{width: "100%", height: 400}}
          resizeMode="center"
      />
      <MyButton title="GET STARTED" onPress={getStarted} />
    </View>
  );
}

export default GetStarted;