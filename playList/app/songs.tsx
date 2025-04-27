import { useEffect, useState } from "react";
import { View, Text, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Linking, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchSongs } from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";
import { styles } from "@/styles/style";

const Songs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showFullName, setShowFullName] = useState(false);

  const {
      data: songs,
      isFetchingMore,
      hasMore,
      fetchData: fetchMoreSongs,
    } = usePaginatedData(fetchSongs, 50);

  const filteredSongs = songs.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.artists[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
  const loadPlaylistsFromStorage = async () => {
    const storedPlaylists = await AsyncStorage.getItem("playlists");
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  };
  loadPlaylistsFromStorage();
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

  const toggleName = () => {
       setShowFullName(!showFullName);
     };

  if (songs.length === 0 && !isFetchingMore) {
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songCard}>
            <Image
              source={{ uri: item.album.images[0].url }}
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>
                {showFullName ? item.name : item.name.slice(0, 25) + (item.name.length > 25 ? "..." : "")}
              </Text>
              <Text style={styles.songArtist}>
                {showFullName ? item.artists[0].name : item.artists[0].name.slice(0, 25) + (item.artists[0].name.length > 25 ? "..." : "")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(item.external_urls.spotify)}
            >
              <Ionicons name="play-circle" size={28} color="#1DB954" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal(item)}
            >
              <Ionicons name="add-circle" size={28} color="#1DB954" />
            </TouchableOpacity>
          </View>
        )}
        onEndReached={hasMore ? fetchMoreSongs : null}
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
