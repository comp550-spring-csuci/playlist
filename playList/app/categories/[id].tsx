import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { fetchCategoricalPlaylist } from "@/services/spotifyService"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
//NOTE: basic code, likely needs adjusting, this hasnt been done yet due to issues with spotifyService.ts not being able to
  //fetch playlists based on categories 
const CategoryPlaylists = () => {
  const { id } = useLocalSearchParams();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("check");
  const router = useRouter();
  useEffect(() => {
    async function loadPlaylists() {
      const data = await fetchCategoricalPlaylist(id as string);
      
      setPlaylists(data);
      setLoading(false);
    }
    loadPlaylists();
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
        <TouchableOpacity onPress={() => router.push("/songs")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <Text style={styles.headerTitle}>{id} Playlists</Text>
      </View>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.external_urls.spotify)}
            style={styles.songCard}
          >
            <Image
              source={{ uri: item.images?.[0]?.url }}
              
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.name}</Text>
              <Text style={styles.songArtist}>{item.owner?.display_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default CategoryPlaylists;
