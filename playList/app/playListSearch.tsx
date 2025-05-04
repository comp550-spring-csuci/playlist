import React, { useEffect, useState } from "react";
import { View, TextInput} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchSongs } from "../services/spotifyService";
import { fetchPodcasts } from "../services/spotifyService";
import { fetchPodcastEpisodes } from "../services/spotifyService";
import { fetchAudiobooks } from "../services/spotifyService";
import { fetchAudiobookChapter } from "../services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";

const PlayListSearch = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      //router.push(`/search?query=${search}`);
    }
  };

  return (
    <View style={styles.searchContainer}>  
      <TextInput
        style={styles.searchInput}  
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
};


export default PlayListSearch;
