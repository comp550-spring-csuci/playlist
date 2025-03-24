// ExistingPlaylistScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal } from "react-native";
import { useRouter } from "expo-router"; // for navigation
import { styles } from "@/styles/style"; // Assuming you have a styles file

const ExistingPlaylistScreen = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState([
    { id: "1", name: "Chill Vibes" },
    { id: "2", name: "Workout Playlist" },
    { id: "3", name: "Top 40 Hits" },
  ]); // Dummy data for existing playlists
  const [newPlaylistName, setNewPlaylistName] = useState(""); // State for new playlist name
  const [isModalVisible, setIsModalVisible] = useState(false); // State to show/hide the modal for creating a new playlist

  // Handle form submission to create a new playlist
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name.");
      return;
    }

    // Create a new playlist and add it to the playlists list
    const newPlaylist = {
      id: (playlists.length + 1).toString(),
      name: newPlaylistName.trim(),
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName(""); // Clear the input field
    setIsModalVisible(false); // Close the modal
  };

  // Function to handle Add Songs navigation
  const handleAddSongs = (playlistId: string) => {
    router.push(`/songs?playlistId=${playlistId}`);
  };

  return (
    <View style={styles.safeAreaContainer}>
      <Text style={styles.headerTitle}>Your Playlists</Text>

      {/* New Playlist Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)} // Show the modal to create a new playlist
        style={styles.button}
      >
        <Text style={styles.buttonText}>Create New Playlist</Text>
      </TouchableOpacity>

      {/* Modal to create a new playlist */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.headerTitle}>Create New Playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Playlist Name"
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <TouchableOpacity onPress={handleCreatePlaylist} style={styles.button}>
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)} // Close the modal without creating a playlist
            style={styles.button}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* List of Created Playlists */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistItem}>
            <Text style={styles.playlistText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => handleAddSongs(item.id)} // Navigate to Songs page with playlist ID
              style={styles.addSongsButton}
            >
              <Text style={styles.buttonText}>Add Songs</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ExistingPlaylistScreen;
