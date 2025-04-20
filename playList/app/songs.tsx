import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchSongs } from "../services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import PlayListSearch from "./playListSearch";

const Songs = () => {
  const router = useRouter();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((item) =>
	item.track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
	item.track.artists[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function loadSongs() {
      try {
        const tracks = await fetchSongs();
        setSongs(tracks);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
}, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Songs</Text>
      </View>
	
	  <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search songs..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>
	  
	{filteredSongs.length === 0 ? (
	  <View style={{ padding: 20 }}>
		<Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
			No results found.
		</Text>
	  </View>
	) : (
      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.track.id}
        renderItem={({ item }) => (
          <View style={styles.songCard}>
            <Image
              source={{ uri: item.track.album.images[0].url }}
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.track.name}</Text>
              <Text style={styles.songArtist}>{item.track.artists[0].name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(item.track.external_urls.spotify)}
              style={styles.playButton}
            >
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
          </View>
        )}
      />
	 )}
    </SafeAreaView>
  );
}

export default Songs;
