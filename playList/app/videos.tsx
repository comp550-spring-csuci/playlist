import React, { useState, useEffect } from "react"; 
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayListSearch from "./playListSearch";
import { styles } from "@/styles/style";

const Videos = () => {
  const videoData = [
    { id: '1', title: 'Video 1' },
    { id: '2', title: 'Video 2' },
    { id: '3', title: 'Video 3' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videoData.filter((item) => {
     const title = item?.title || ""; 
	 return title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Videos</Text>
        </View>
		
	  <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>
	  
	  {filteredVideos.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
              No results found.
            </Text>
          </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={item => item.id}
		  renderItem={({ item }) => (
			<View style={styles.songCard}>
				<Text style={styles.songTitle}>{item.title}</Text>
			</View>
		  )}
        />
	   )}
    </SafeAreaView>
  );
};

export default Videos;
