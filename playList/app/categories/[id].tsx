import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchCategoricalPlaylist } from "@/services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AudioPlayer from "@/components/AudioPlayer";
import { styles } from "@/styles/style";

const CategoryPlaylists = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [existingPlaylistModalVisible, setExistingPlaylistModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playlistsStore, setPlaylistsStore] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    async function loadPlaylists() {
      const data = await fetchCategoricalPlaylist(id as string);
      setPlaylists(data);
      setLoading(false);
    }
    loadPlaylists();
    loadStoredPlaylists();
  }, []);

  const loadStoredPlaylists = async () => {
    const stored = await AsyncStorage.getItem("playlists");
    if (stored) setPlaylistsStore(JSON.parse(stored));
  };

  const savePlaylists = async (updated) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updated));
    setPlaylistsStore(updated);
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeAllModals = () => {
    setModalVisible(false);
    setNewPlaylistModalVisible(false);
    setExistingPlaylistModalVisible(false);
    setSelectedItem(null);
  };

  const handleCreatePlaylist = () => {
    const exists = playlistsStore.some(p => p.name.toLowerCase() === newPlaylistName.toLowerCase());
    if (exists) {
      Toast.show({ type: 'error', text1: 'Playlist already exists.' });
      return;
    }
    const newPlaylist = { name: newPlaylistName, songs: [selectedItem] };
    const updated = [...playlistsStore, newPlaylist];
    savePlaylists(updated);
    Toast.show({ type: 'success', text1: `Created ${newPlaylistName}`, text2: 'Item added.' });
    closeAllModals();
  };

  const handleAddToExisting = (index) => {
    const updated = [...playlistsStore];
    const playlist = updated[index];
    const exists = playlist.songs.some(song => song.id === selectedItem.id);
    if (exists) {
      Toast.show({ type: 'info', text1: 'Already in playlist' });
    } else {
      playlist.songs.push(selectedItem);
      savePlaylists(updated);
      Toast.show({ type: 'success', text1: `Added to ${playlist.name}` });
    }
    closeAllModals();
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{id} Playlists</Text>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songCard}>
            <Image source={{ uri: item.images?.[0]?.url }} style={styles.songImage} />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.name}</Text>
              <Text style={styles.songArtist}>{item.owner?.display_name}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(item.external_urls.spotify)}>
              <Ionicons name="play-circle" size={24} color="#1DB954" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openModal(item)}>
              <Ionicons name="add-circle" size={24} color="#1DB954" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Playlist Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              setModalVisible(false);
              setExistingPlaylistModalVisible(true);
            }}>
              <Text style={styles.modalButtonText}>Existing Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              setModalVisible(false);
              setNewPlaylistModalVisible(true);
            }}>
              <Text style={styles.modalButtonText}>New Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeAllModals}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      <Modal transparent visible={existingPlaylistModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Playlist</Text>
            {playlistsStore.map((pl, idx) => (
              <TouchableOpacity key={idx} style={styles.modalButton} onPress={() => handleAddToExisting(idx)}>
                <Text style={styles.modalButtonText}>{pl.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={closeAllModals}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {previewUrl && activeItem && (
        <AudioPlayer
          previewUrl={previewUrl}
          songName={activeItem.name}
          artistName={activeItem.owner?.display_name || ""}
          onClose={() => {
            setPreviewUrl("");
            setActiveItem(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryPlaylists;
