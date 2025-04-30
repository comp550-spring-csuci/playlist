import React, { useState, useEffect } from "react"; 
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayListSearch from "./playListSearch";
import { styles } from "@/styles/style";
import { fetchPodcasts } from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";

const Podcasts = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullName, setShowFullName] = useState(false);

  const {
    data: podcasts,
    isFetchingMore,
    hasMore,
    fetchData: fetchMorePodcasts,
  } = usePaginatedData(fetchPodcasts, 50);

  const filteredPodcasts = podcasts.filter((item) => {
     const title = item?.title || ""; 
	 return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

    const toggleName = () => {
         setShowFullName(!showFullName);
       };

   if (podcasts.length === 0 && !isFetchingMore) {
         return (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="large" color="#1DB954" />
           </View>
         );
       }

  return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push("/AppTabs")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Podcasts</Text>
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
          keyExtractor={item => item.id}
		  renderItem={({ item }) => (
			<View >
			  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/podcastEpisodes', params: { podcast: JSON.stringify(item) } })}
                    style={styles.songCard}
                  >
                <Image
                  source={{ uri: item.images[0].url }}
                  style={styles.songImage}
                />
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle}>
                    {showFullName ? item.name : item.name.slice(0, 25) + (item.name.length > 25 ? "..." : "")}
                  </Text>
                  <Text style={styles.songArtist}>
                    {showFullName ? item.publisher : item.publisher.slice(0, 25) + (item.publisher.length > 25 ? "..." : "")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.external_urls.spotify)}
                >
                  <Ionicons name="play-circle" size={28} color="#1DB954" />
                </TouchableOpacity>

                <TouchableOpacity
                  //onPress={() => openModal(item.track)}
                >
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
            <Text style={{ textAlign: "center", padding: 10, color: "gray" }}>
              No more songs
            </Text>
          ) : null
        }
        />
	   )}
    </SafeAreaView>
  );
};

export default Podcasts;
