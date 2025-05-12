import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker"; //for category selection
import { styles } from "@/styles/style";
import { fetchPodcasts } from "../services/spotifyService"; //function to fetch podcasts from Spotify
import usePaginatedData from "../hooks/usePaginatedData";

const Podcasts = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullName, setShowFullName] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Comedy");

  //fetch podcasts based on category
  const fetchFunction = useCallback(
    (offset = 0, limit = 50) => fetchPodcasts(selectedCategory, offset, limit),
    [selectedCategory]
  );

  const {
    data: podcasts,
    isFetchingMore,
    hasMore,
    fetchData: fetchMorePodcasts,
  } = usePaginatedData(fetchFunction, 50);

  //filter podcasts by title or publisher match
  const filteredPodcasts = podcasts.filter((item) => {
    const title = item?.name || "";
    const publisher = item?.publisher || "";
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleName = () => setShowFullName(!showFullName);

  //loading indicator
  if (podcasts.length === 0 && isFetchingMore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.push("/AppTabs")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Podcasts</Text>

        {/*Picker for filtering podcast list by category*/}
        <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        mode="dropdown"
        style={{ height: 32, width: 90, marginLeft: 70, fontSize: 13}}
        >
          <Picker.Item label="Comedy" value="Comedy" />
          <Picker.Item label="Technology" value="Technology" />
          <Picker.Item label="Sports" value="Sports" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Finance" value="Finance" />
          <Picker.Item label="News" value="News" />
          
        </Picker>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search podcasts..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>

      {filteredPodcasts.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
            No results found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPodcasts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/podcastEpisodes",
                    params: { podcast: JSON.stringify(item) },
                  })
                }
                style={styles.songCard}
              >
                <Image
                  source={{ uri: item.images[0]?.url }}
                  style={styles.songImage}
                />
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle}>
                    {showFullName
                      ? item.name
                      : item.name.slice(0, 25) +
                        (item.name.length > 25 ? "..." : "")}
                  </Text>
                  <Text style={styles.songArtist}>
                    {showFullName
                      ? item.publisher
                      : item.publisher.slice(0, 25) +
                        (item.publisher.length > 25 ? "..." : "")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.external_urls.spotify)}
                >
                  <Ionicons name="play-circle" size={28} color="#1DB954" />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Ionicons name="add-circle" size={28} color="#1DB954" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          onEndReached={hasMore ? fetchMorePodcasts : null}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#1DB954" />
            ) : !hasMore ? (
              <Text
                style={{ textAlign: "center", padding: 10, color: "gray" }}
              >
                No more podcasts
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Podcasts;
