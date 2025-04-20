import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchSongs } from "../services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import PlayListSearch from "./playListSearch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';


const Songs = () => {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const filteredSongs = songs.filter((item) =>
    item.track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.track.artists[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function loadSongs() {
      try {
        const tracks = await fetchSongs();
        setSongs(tracks);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
    const loadPlaylists = async () => {
        const storedPlaylists = await AsyncStorage.getItem("playlists");
        if (storedPlaylists) {
          setPlaylists(JSON.parse(storedPlaylists));
        }
      };
      loadPlaylists();
  }, []);

  const openModal = (song: any) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSong(null);
  };
  const savePlaylists = async (updatedPlaylists: any[]) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
  };
  
  const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: newPlaylistName,
      songs: [selectedSong],
    };
  
    const updatedPlaylists = [...playlists, newPlaylist];
    savePlaylists(updatedPlaylists);
    setNewPlaylistModalVisible(false);
    setNewPlaylistName("");
    closeModal();
    router.push("/playlist");
  };
  
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
        <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Songs</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search songs..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>
         
       {filteredSongs.length === 0 ? (
         <View style={{ padding: 20 }}>
               <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
                       No results found.
               </Text>
         </View>
       ) : (

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.track.id}
        renderItem={({ item }) => (
          <View style={styles.songCard}>
            <Image
              source={{ uri: item.track.album.images[0].url }}
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.track.name}</Text>
              <Text style={styles.songArtist}>{item.track.artists[0].name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(item.track.external_urls.spotify)}
              style={styles.playButton}
            >
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal(item.track)}
              style={styles.playButton}
            >
              <Text style={styles.playButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ADD TO</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // TODO: Add to Existing Playlist
                closeModal();
                router.push({
                    pathname: "/playlist",
                    params: {
                      songToAdd: JSON.stringify(selectedSong), // Serialize for navigation
                    },
                  });
              }}
            >
              <Text style={styles.modalButtonText}>Existing Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
            setModalVisible(false);
            setNewPlaylistModalVisible(true);
                }}
            >
  <Text style={styles.modalButtonText}>New Playlist</Text>
    </TouchableOpacity>

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
  transparent={true}
  visible={newPlaylistModalVisible}
  animationType="slide"
  onRequestClose={() => setNewPlaylistModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Create New Playlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Playlist Name"
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
      />
      <TouchableOpacity style={styles.modalButton} onPress={handleCreatePlaylist}>
        <Text style={styles.modalButtonText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setNewPlaylistModalVisible(false)}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
 
</Modal>


    </SafeAreaView>
  );
};

export default Songs;
