import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchRelatedArtistTracks } from "../services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";

const RelatedArtistTracks = () => {
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      const result = await fetchRelatedArtistTracks("11dFghVXANMlKmJXsNCbNl"); // hardcoded in service
      setTracks(result);
      setLoading(false);
    }
    loadTracks();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Loading tracks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tracks.length) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No tracks found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Tracks</Text>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/track/${item.id}`)}>
            <View style={styles.songCard}>
              {item.album?.images?.[0]?.url && (
                <Image
                  source={{ uri: item.album.images[0].url }}
                  style={styles.songImage}
                />
              )}
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.name}</Text>
                <Text style={styles.songSubtitle}>{item.artists[0]?.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default RelatedArtistTracks;