import { useEffect, useState } from "react";
import { View, Text, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Platform, Linking, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchSongs, fetchCategories } from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";
import { styles } from "@/styles/style";
import AudioPlayer from "@/components/AudioPlayer";
import Toast from 'react-native-toast-message';

const Songs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [existingPlaylistModalVisible, setExistingPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showFullName, setShowFullName] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeSong, setActiveSong] = useState<any | null>(null);
  const [lyricsModalVisible, setLyricsModalVisible] = useState(false);
  const [lyricsContent, setLyricsContent] = useState("");
  const [lyricsUrl, setLyricsUrl] = useState("");


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
  const loadPlaylists = async () => {
    const stored = await AsyncStorage.getItem("playlists");
    if (stored) {
      setPlaylists(JSON.parse(stored));
    }
  };
  loadPlaylists();
    }, []);

  useEffect(() => {
      async function loadCategories() {
          const categories = await fetchCategories();
          setCategories(categories);
      }
      loadCategories();
  }, []);

  const savePlaylists = async (updated) => {
      await AsyncStorage.setItem("playlists", JSON.stringify(updated));
      setPlaylists(updated);
    };

  const openModal = (song: any) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const closeAllModals = () => {
    setModalVisible(false);
    setNewPlaylistModalVisible(false);
    setExistingPlaylistModalVisible(false);
    setSelectedSong(null);
  };

  /*const savePlaylists = async (updatedPlaylists: any[]) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
  };*/

  /*const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: newPlaylistName,
      songs: [selectedSong],
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    savePlaylists(updatedPlaylists);
    setNewPlaylistModalVisible(false);
    setNewPlaylistName("");
    closeModal();
    // router.push("/playlist");
    Toast.show({
      type: 'success',
      text1: `Added Successfully to ${newPlaylistName}.`,
    });
  };*/
  const handleCreatePlaylist = () => {
      const exists = playlists.some(p => p.name.toLowerCase() === newPlaylistName.toLowerCase());
      if (exists) {
        Toast.show({ type: 'error', text1: 'Playlist already exists.' });
        return;
      }

      const newPlaylist = { name: newPlaylistName, songs: [selectedSong] };
      const updated = [...playlists, newPlaylist];
      savePlaylists(updated);
      Toast.show({ type: 'success', text1: `Created ${newPlaylistName}`, text2: 'Song added.' });
      closeAllModals();
    };

    const handleAddToExisting = (playlistIndex) => {
      const updated = [...playlists];
      const playlist = updated[playlistIndex];

      const alreadyIn = playlist.songs.some(song => song.id === selectedSong.id);
      if (alreadyIn) {
        Toast.show({ type: 'info', text1: 'Song already in playlist' });
      } else {
        playlist.songs.push(selectedSong);
        savePlaylists(updated);
        Toast.show({ type: 'success', text1: `Added to ${playlist.name}` });
      }

      closeAllModals();
    };


  const toggleName = () => {
       setShowFullName(!showFullName);
     };

  const handleLyricsPress = async (artist: string, title: string) => {
    const result = encodeURIComponent(`${artist} ${title}`);
    const geniusUrl = `https://genius.com/search?q=${result}`;

    if (Platform.OS === "web") {
        window.open(geniusUrl, "_blank");
    } else {
        setLyricsContent("View full lyrics on Genius.");
        setLyricsUrl(geniusUrl);
        setLyricsModalVisible(true);
    }
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
        <TouchableOpacity onPress={() => router.push("/AppTabs")} style={styles.backButton}>
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

      <View style={{ paddingVertical: 10 }}>
        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: "bold" }}>Top Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() =>
                router.push({
                  pathname: `/categories/${item.name}`,
                })
              }
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: item.icons[0]?.url }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
                <Text
                  style={{ maxWidth: 100, textAlign: "center", marginTop: 5 }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
                {showFullName
                    ? item.name
                    : `${item.name.slice(0, 25)}${item.name.length > 25 ? "..." : ""}`}
              </Text>
              <Text style={styles.songArtist}>
                {showFullName
                    ? item.artists[0].name
                    : `${item.artists[0].name.slice(0, 25)}${item.artists[0].name.length > 25 ? "..." : ""}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
              setPreviewUrl(item.preview_url);
              setActiveSong(item);
            }}
            >
              <Ionicons name="play-circle" size={28} color="#1DB954" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal(item)}
            >
              <Ionicons name="add-circle" size={28} color="#1DB954" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLyricsPress(item.artists[0].name, item.name)}
            >
              <Ionicons name="document-text" size={24} color="#1DB954" />
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

      {/* Main Playlist Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"

      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ADD TO</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                setExistingPlaylistModalVisible(true);
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

            <TouchableOpacity onPress={closeAllModals}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Playlist Modal */}
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
      <TouchableOpacity onPress={closeAllModals}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
  </Modal>

  {/* Existing Playlist Modal */}
<Modal transparent visible={existingPlaylistModalVisible} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Playlist</Text>
      {playlists.map((playlist, index) => (
        <TouchableOpacity
          key={index}
          style={styles.modalButton}
          onPress={() => handleAddToExisting(index)}
        >
          <Text style={styles.modalButtonText}>{playlist.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={closeAllModals}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


  {/* Lyrics Modal*/}
      <Modal transparent visible={lyricsModalVisible} animationType="slide" onRequestClose={() => setLyricsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lyrics</Text>
            {lyricsUrl ? (
              <TouchableOpacity onPress={() => Linking.openURL(lyricsUrl)}>
                <Text style={{ color: "#1DB954", textAlign: "center" }}>Open in Genius</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ maxHeight: 300, marginVertical: 10 }}>{lyricsContent}</Text>
            )}
            <TouchableOpacity onPress={() => setLyricsModalVisible(false)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    {/* Toast Message Display is handled globally in _layout.tsx */}
    {previewUrl && activeSong && (
      <AudioPlayer
        previewUrl={previewUrl}
        songName={activeSong.name}
        artistName={activeSong.artists[0].name}
        onClose={() => {
          setPreviewUrl("");
          setActiveSong(null);
        }}
      />
    )}
    </SafeAreaView>
  );
};

export default Songs;