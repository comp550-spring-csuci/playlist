import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import { fetchVideos } from "../services/youtubeService";
import { usePaginatedData } from "../hooks/usePaginatedData";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 15; // Two cards per row with spacing

const Videos = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("latest music");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { videos } = await fetchVideos(searchQuery);
      setVideos(videos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { videos } = await fetchVideos(searchQuery);
      setVideos(videos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        width: CARD_WIDTH,
        elevation: 4,
      }}
      onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.id.videoId}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={{
          width: "100%",
          height: 120,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "600", fontSize: 14 }} numberOfLines={2}>
          {item.snippet.title}
        </Text>
        <Text style={{ fontSize: 12, color: "gray", marginTop: 4 }} numberOfLines={1}>
          {item.snippet.channelTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/AppTabs")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos</Text>
      </View>

      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : videos.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
            No results found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.videoId}
          renderItem={renderItem}
          numColumns={2} // 2 cards per row
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </SafeAreaView>
  );
};

export default Videos;
