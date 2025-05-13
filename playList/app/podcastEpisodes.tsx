import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "@/styles/style";
import { fetchPodcastEpisodes } from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";
import AudioPlayer from "@/components/AudioPlayer";
import Toast from 'react-native-toast-message';

const PodcastEpisodes = () => {
  const router = useRouter();
  const { podcast } = useLocalSearchParams();
  const show = JSON.parse(podcast);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [existingPlaylistModalVisible, setExistingPlaylistModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const fetchPaginatedEpisodes = useCallback(
    async (offset: number, limit: number) => {
      return await fetchPodcastEpisodes(show.id, offset, limit);
    },
    [show.id]
  );

  const {
    data: episodes,
    isFetchingMore,
    hasMore,
    fetchData
  } = usePaginatedData(fetchPaginatedEpisodes, 50);

  useEffect(() => {
    const loadPlaylists = async () => {
      const stored = await AsyncStorage.getItem("playlists");
      if (stored) setPlaylists(JSON.parse(stored));
    };
    loadPlaylists();
  }, []);

  const savePlaylists = async (updated) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updated));
    setPlaylists(updated);
  };

  const openModal = (episode) => {
    setSelectedEpisode(episode);
    setModalVisible(true);
  };

  const closeAllModals = () => {
    setModalVisible(false);
    setNewPlaylistModalVisible(false);
    setExistingPlaylistModalVisible(false);
    setSelectedEpisode(null);
  };

  const handleCreatePlaylist = () => {
    const exists = playlists.some(p => p.name.toLowerCase() === newPlaylistName.toLowerCase());
    if (exists) {
      Toast.show({ type: 'error', text1: 'Playlist already exists.' });
      return;
    }
    const newPlaylist = { name: newPlaylistName, songs: [selectedEpisode] };
    const updated = [...playlists, newPlaylist];
    savePlaylists(updated);
    Toast.show({ type: 'success', text1: `Created ${newPlaylistName}`, text2: 'Episode added.' });
    closeAllModals();
  };

  const handleAddToExisting = (playlistIndex) => {
    const updated = [...playlists];
    const playlist = updated[playlistIndex];
    const alreadyIn = playlist.songs.some(song => song.id === selectedEpisode.id);
    if (alreadyIn) {
      Toast.show({ type: 'info', text1: 'Episode already in playlist' });
    } else {
      playlist.songs.push(selectedEpisode);
      savePlaylists(updated);
      Toast.show({ type: 'success', text1: `Added to ${playlist.name}` });
    }
    closeAllModals();
  };

  const formatDuration = (durationMs) => {
    if (!durationMs) return 'Duration unknown';
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handlePlay = (item, index) => {
    if (!item.audio_preview_url) {
      Alert.alert("Playback not available", "This episode does not have a preview.");
      return;
    }
    if (currentIndex === index) {
      setIsPlaying(prev => !prev);
    } else {
      setPreviewUrl(item.audio_preview_url);
      setActiveEpisode(item);
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNextEpisode = () => {
    if (currentIndex !== null && currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setActiveEpisode(next);
      setPreviewUrl(next.audio_preview_url);
      setIsPlaying(true);
    }
  };

  const handlePreviousEpisode = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const prev = episodes[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      setActiveEpisode(prev);
      setPreviewUrl(prev.audio_preview_url);
      setIsPlaying(true);
    }
  };

  const renderEpisode = ({ item, index }) => {
    const isCurrent = currentIndex === index;
    return (
      <View style={styles.songCard}>
        <Image source={{ uri: item.images?.[0]?.url }} style={styles.songImage} />
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>
            {item.name.length > 25 ? item.name.slice(0, 25) + "..." : item.name}
          </Text>
          <Text style={styles.songArtist}>{formatDuration(item.duration_ms)}</Text>
        </View>
        <TouchableOpacity onPress={() => handlePlay(item, index)}>
          <Ionicons name={isCurrent && isPlaying ? "pause-circle" : "play-circle"} size={28} color="#1DB954" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(item)}>
          <Ionicons name="add-circle" size={28} color="#1DB954" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/podcasts")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{show.name} - {show.total_episodes} Episodes</Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}>About</Text>
        <Text style={{ fontSize: 16, color: "#444", lineHeight: 22 }}>
          {showFullDescription
            ? show.description
            : show.description.slice(0, 250) + (show.description.length > 250 ? "..." : "")}
        </Text>
        {show.description.length > 250 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={{ color: "#1DB954", marginTop: 4, fontWeight: "600" }}>
              {showFullDescription ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10, paddingHorizontal: 16 }}>All Episodes</Text>

      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={renderEpisode}
        onEndReached={() => { if (hasMore && !isFetchingMore) fetchData(); }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="large" color="#1DB954" />
            </View>
          ) : !hasMore ? (
            <Text style={{ textAlign: "center", padding: 10, color: "gray" }}>No more episodes</Text>
          ) : null
        }
      />

      {/* Modal to choose add to existing or new */}
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

      {activeEpisode && (
        <AudioPlayer
          previewUrl={previewUrl}
          songName={activeEpisode.name}
          artistName={show.publisher}
          onClose={() => {
            setPreviewUrl("");
            setActiveEpisode(null);
            setCurrentIndex(null);
            setIsPlaying(false);
          }}
          onNext={handleNextEpisode}
          onPrevious={handlePreviousEpisode}
          disableNext={currentIndex === episodes.length - 1}
          disablePrevious={currentIndex === 0}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      )}
    </SafeAreaView>
  );
};

export default PodcastEpisodes;
