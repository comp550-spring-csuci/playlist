import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import { fetchPodcastEpisodes } from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";
import AudioPlayer from "@/components/AudioPlayer";

const PodcastEpisodes = () => {
  const router = useRouter();
  const { podcast } = useLocalSearchParams();
  const show = JSON.parse(podcast);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeEpisode, setActiveEpisode] = useState(null);

  const fetchPaginatedEpisodes = useCallback(
      async (offset: number, limit: number) => {
        return await fetchPodcastEpisodes(show.id, offset, limit);
      },
      [show.id]
    );

  const {
      data: episodes,
      isFetchingMore,
      hasMore,
      fetchData
    } = usePaginatedData(fetchPaginatedEpisodes, 50);

    const formatDuration = (durationMs) => {
      if (!durationMs) return 'Duration unknown';

      const totalMinutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

   const toggleDescription = () => {
     setShowFullDescription(!showFullDescription);
   };

 const renderEpisode = ({ item }: any) => (
     <View style={styles.songCard}>
       <Image source={{ uri: item.images?.[0]?.url }} style={styles.songImage} />
       <View style={styles.songDetails}>
         <Text style={styles.songTitle}>
           {item.name.length > 25 ? item.name.slice(0, 25) + "..." : item.name}
         </Text>
         <Text style={styles.songArtist}>{formatDuration(item.duration_ms)}</Text>
       </View>
       <TouchableOpacity
         onPress={() => {
             setPreviewUrl(item.audio_preview_url);
             setActiveEpisode(item);}}>
         <Ionicons name="play-circle" size={28} color="#1DB954" />
       </TouchableOpacity>
       <TouchableOpacity>
         <Ionicons name="add-circle" size={28} color="#1DB954" />
       </TouchableOpacity>
     </View>
   );


  return (
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.push("/podcasts")} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{show.name} - {show.total_episodes} Episodes</Text>
          </View>
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}>
                About
              </Text>
              <Text style={{ fontSize: 16, color: "#444", lineHeight: 22 }}>
                {showFullDescription ? show.description : show.description.slice(0, 250) + (show.description.length > 250 ? "..." : "")}
              </Text>
              {show.description.length > 250 && (
                  <TouchableOpacity onPress={toggleDescription}>
                    <Text style={{ color: "#1DB954", marginTop: 4, fontWeight: "600" }}>
                      {showFullDescription ? "Show less" : "Show more"}
                    </Text>
                  </TouchableOpacity>
                )}
          </View>

          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10, paddingHorizontal: 16 }}>
              All Episodes
          </Text>

          <FlatList
                  data={episodes}
                  keyExtractor={(item) => item.id}
                  renderItem={renderEpisode}
                  onEndReached={() => {
                    if (hasMore && !isFetchingMore) fetchData();
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    isFetchingMore ? (
                      <View style={{ paddingVertical: 16 }}>
                        <ActivityIndicator size="large" color="#1DB954" />
                      </View>
                    ) : !hasMore ? (
                              <Text style={{ textAlign: "center", padding: 10, color: "gray" }}>
                                No more episodes
                              </Text>
                            ) : null
                  }
                />
      {activeEpisode && (
        <AudioPlayer
          previewUrl={previewUrl}
          songName={activeEpisode.name}
          artistName={show.publisher}  // or something like item.show.name
          onClose={() => {
            setPreviewUrl("");
            setActiveEpisode(null);
          }}
        />
      )}
      </SafeAreaView>
    );
};

export default PodcastEpisodes;