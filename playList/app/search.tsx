import React from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import { useLocalSearchParams } from "expo-router";

const data = [
  { id: "1", title: "Api", artist: "Odiseo", type: "song" },
  { id: "2", title: "Podcast 1", type: "podcast" },
  { id: "3", title: "Audiobooks 1", type: "audiobook" },
  { id: "4", title: "Video 1", type: "video" },
  { id: "5", title: "Is", artist: "Vlasta Marek", type: "song" },
  { id: "6", title: "Podcast 2", type: "podcast" },
  { id: "7", title: "Audiobooks 2", type: "audiobook" },
  { id: "8", title: "Video 2", type: "video" },
  { id: "9", title: "All I Want", artist: "LCD Soundsystem", type: "song" },
  { id: "10", title: "Podcast 3", type: "podcast" },
  { id: "11", title: "Audiobooks 3", type: "audiobook" },
  { id: "12", title: "Video 3", type: "video" },
  { id: "13", title: "Endpoints", artist: "Glenn Horiuchi Trio", type: "song" },
  { id: "14", title: "You Are So Beautiful", artist: "Zucchero", type: "song" },
];

const SearchResults = () => {
  const { query } = useLocalSearchParams();

  const filteredData = data.filter((item) =>
    item.title?.toLowerCase().includes(query?.toLowerCase() || "")
  );

  return (
    <View style={styles.container}>
	  <Text style={styles.searchHeader}>Search Results for: "{query}"</Text>
	  {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.title ?? "Untitled"}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No results found.</Text>
      )}
    </View>
  );
};

export default SearchResults;
 