import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/styles/style";
import { useLocalSearchParams } from "expo-router";

const Playlist = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const songToAdd = params.songToAdd ? JSON.parse(params.songToAdd as string) : null;


  // Load playlists from AsyncStorage
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const stored = await AsyncStorage.getItem("playlists");
        if (stored) {
          setPlaylists(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    };

    loadPlaylists();
  }, []);

  const deletePlaylist = async (index: number) => { 
         const updatedPlaylists = [...playlists];
            updatedPlaylists.splice(index, 1);
            setPlaylists(updatedPlaylists);
            await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/songs")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlists</Text>
      </View>

      {/* List of Playlists */}
      {playlists.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>No playlists found. Create one from Songs page!</Text>
        </View>
      ) : (
        <FlatList
  data={playlists}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      onPress={async () => {
        if (songToAdd) {
          const updatedPlaylists = [...playlists];
          updatedPlaylists[index].songs.push(songToAdd);
          await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
          setPlaylists(updatedPlaylists);
        }
      }}
    >
      <View style={styles.songCard}>
      <View style={{ flex: 1 }}>
  <Text style={styles.playlistName}>{item.name}</Text>
  <Text style={styles.playlistSongCount}>{item.songs.length} song(s)</Text>
</View>
<TouchableOpacity onPress={() => deletePlaylist(index)}>
  <Ionicons name="trash-outline" size={24} color="red" />
</TouchableOpacity>
</View>
    </TouchableOpacity>
  )}
/>

      )}
    </SafeAreaView>
  );
};

export default Playlist;
