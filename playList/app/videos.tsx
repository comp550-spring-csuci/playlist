// updated videos.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import { fetchVideos } from "../services/youtubeService";
import { searchAppleMusicVideos } from "../services/appleServices";
import AudioPlayer from "@/components/AudioPlayer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 15;

const Videos = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("kendrick lamar");
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [appleVideos, setAppleVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [existingPlaylistModalVisible, setExistingPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const allVideos = [...appleVideos, ...youtubeVideos];

  useEffect(() => {
    loadVideos();
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    const stored = await AsyncStorage.getItem("playlists");
    if (stored) setPlaylists(JSON.parse(stored));
  };

  const savePlaylists = async (updated) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updated));
    setPlaylists(updated);
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const { videos } = await fetchVideos(searchQuery);
      const apple = await searchAppleMusicVideos(searchQuery);
      setYoutubeVideos(videos);
      setAppleVideos(apple);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { videos } = await fetchVideos(searchQuery);
      const apple = await searchAppleMusicVideos(searchQuery);
      setYoutubeVideos(videos);
      setAppleVideos(apple);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (item, index) => {
    const preview = item.preview_url || item.attributes?.previews?.[0]?.url;
    if (!preview) return;
    setPreviewUrl(preview);
    setActiveVideo({
      name: item.snippet?.title || item.attributes?.name,
      artist: item.snippet?.channelTitle || item.attributes?.artistName,
    });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex === null) return;
    for (let i = currentIndex + 1; i < allVideos.length; i++) {
      const item = allVideos[i];
      const preview = item.preview_url || item.attributes?.previews?.[0]?.url;
      if (preview) return handlePlay(item, i);
    }
  };

  const handlePrevious = () => {
    if (currentIndex === null) return;
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = allVideos[i];
      const preview = item.preview_url || item.attributes?.previews?.[0]?.url;
      if (preview) return handlePlay(item, i);
    }
  };

  const openModal = (video) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const closeAllModals = () => {
    setModalVisible(false);
    setNewPlaylistModalVisible(false);
    setExistingPlaylistModalVisible(false);
    setSelectedVideo(null);
  };

  const handleCreatePlaylist = () => {
    const exists = playlists.some(p => p.name.toLowerCase() === newPlaylistName.toLowerCase());
    if (exists) {
      Toast.show({ type: 'error', text1: 'Playlist already exists.' });
      return;
    }
    const newPlaylist = { name: newPlaylistName, songs: [selectedVideo] };
    const updated = [...playlists, newPlaylist];
    savePlaylists(updated);
    Toast.show({ type: 'success', text1: `Created ${newPlaylistName}`, text2: 'Video added.' });
    closeAllModals();
  };

  const handleAddToExisting = (index) => {
    const updated = [...playlists];
    const playlist = updated[index];
    const alreadyIn = playlist.songs.some(song => song.id === selectedVideo.id);
    if (alreadyIn) {
      Toast.show({ type: 'info', text1: 'Video already in playlist' });
    } else {
      playlist.songs.push(selectedVideo);
      savePlaylists(updated);
      Toast.show({ type: 'success', text1: `Added to ${playlist.name}` });
    }
    closeAllModals();
  };

  const renderItem = ({ item, index }) => {
    const artworkUrl = item.attributes?.artwork?.url?.replace('{w}', '300').replace('{h}', '300');
    const preview = item.preview_url || item.attributes?.previews?.[0]?.url;
    const name = item.snippet?.title || item.attributes?.name;
    const artist = item.snippet?.channelTitle || item.attributes?.artistName;
    const image = item.snippet?.thumbnails?.medium?.url || artworkUrl;

    return (
      <View style={style.card}>
        <TouchableOpacity onPress={() => preview && handlePlay(item, index)}>
          <Image source={{ uri: image }} style={style.thumbnail} />
        </TouchableOpacity>
        <View style={{ padding: 10 }}>
          <Text style={style.videoTitle} numberOfLines={2}>{name}</Text>
          <View style={style.videoFooter}>
            <Text numberOfLines={1} style={style.channelName}>{artist}</Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity onPress={() => preview && handlePlay(item, index)}>
                <Ionicons name="play-circle" size={24} color="#1DB954" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Ionicons name="add-circle" size={24} color="#1DB954" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={allVideos}
          keyExtractor={(item, index) => item.id?.videoId || item.id || index.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}

      {previewUrl && activeVideo && (
        <AudioPlayer
          previewUrl={previewUrl}
          songName={activeVideo.name}
          artistName={activeVideo.artist}
          onClose={() => {
            setPreviewUrl("");
            setActiveVideo(null);
            setCurrentIndex(null);
          }}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {/* Playlist Action Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
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
      <Modal transparent visible={newPlaylistModalVisible} animationType="slide">
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
    </SafeAreaView>
  );
};

const style = {
  ...require("@/styles/style").styles,
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    width: CARD_WIDTH,
    elevation: 4,
  },
  thumbnail: {
    width: "100%",
    height: 120,
  },
  videoTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  videoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  channelName: {
    fontSize: 12,
    color: "gray",
    flexShrink: 1,
  },
};

export default Videos;
