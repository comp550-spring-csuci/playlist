
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function Playlists() {
  return (

  
      <View style={styles.indexContainer}></View>

  );
}

const styles = StyleSheet.create({

  indexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 140,
    backgroundColor: "white",
  }


});
