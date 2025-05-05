import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/styles/style";
import { useLocalSearchParams } from "expo-router";

const Playlists = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const songToAdd = params.songToAdd ? JSON.parse(params.songToAdd as string) : null;
  const [incomingSong, setIncomingSong] = useState<any | null>(null);
  const [songAdded, setSongAdded] = useState<boolean>(false);

    // UseEffect to set incomingSong when songToAdd is available
    useEffect(() => {
      if (songToAdd) {
        setIncomingSong(songToAdd); // Only once
      }
    }, [songToAdd]);

  // Load playlists from AsyncStorage
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const stored = await AsyncStorage.getItem("playlists");
        if (stored) {
          setPlaylists(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    };
    
    loadPlaylists();
  }, []);

  const deletePlaylist = async (index: number) => { 
         const updatedPlaylists = [...playlists];
            updatedPlaylists.splice(index, 1);
            setPlaylists(updatedPlaylists);
            await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/AppTabs")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlists</Text>
      </View>

      {/* List of Playlists */}
      {playlists.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>No playlists found. Create one from the Home page!</Text>
        </View>
      ) : (
        
        <FlatList
        data={playlists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.songCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.playlistName}>{item.name}</Text>
              <Text style={styles.playlistSongCount}>{item.songs.length} song(s)</Text>
            </View>
      
         
      
            {/* Plus Icon to Add Song to Playlist */}
            <TouchableOpacity
              onPress={async () => {
                if (songAdded) {
                  Alert.alert("Song Already Added", "You can only add the song to one playlist in this session.");
                  return;
                }
      
                if (incomingSong) {
                  const updatedPlaylists = [...playlists];
                  const alreadyExists = updatedPlaylists[index].songs.some(
                    (song) => song.id === incomingSong.id
                  );
      
                  if (!alreadyExists) {
                    updatedPlaylists[index].songs.push(incomingSong);
                    await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
                    setPlaylists(updatedPlaylists);
                    setSongAdded(true); // Prevent future additions
                    setIncomingSong(null); // Clear incomingSong
                    Alert.alert("Song Added!", `Added to playlist "${updatedPlaylists[index].name}"`);
                  } else {
                    Alert.alert("Already Exists", "This song is already in the selected playlist.");
                  }
                }
              }}
            >
              <Ionicons name="add-circle" size={28} color="#1DB954" />
            </TouchableOpacity>

               {/* Trash Icon to Delete Playlist */}
               <TouchableOpacity onPress={() => deletePlaylist(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      

      )}
    </SafeAreaView>
  );
};

export default Playlists;
