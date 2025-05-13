// ✅ Updated PlaylistSongs.tsx to support skip logic + delete support + video playback
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "@/styles/style";
import AudioPlayer from "@/components/AudioPlayer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlaylistSongs = () => {
  const { playlist } = useLocalSearchParams();
  const router = useRouter();
  const parsed = playlist ? JSON.parse(playlist as string) : null;
  const [songs, setSongs] = useState(parsed?.songs || []);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeSong, setActiveSong] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    setSongs(parsed?.songs || []);
  }, [playlist]);

  const hasPreview = (item: any) =>
    item.preview_url || item.audio_preview_url || item.attributes?.previews?.[0]?.url;

  const getPreviewUrl = (item: any) =>
    item.preview_url || item.audio_preview_url || item.attributes?.previews?.[0]?.url;

  const getImageUrl = (item: any) =>
    item.album?.images?.[0]?.url ||
    item.images?.[0]?.url ||
    item.attributes?.artwork?.url?.replace("{w}", "300").replace("{h}", "300") ||
    item.snippet?.thumbnails?.medium?.url ||
    null;

  const getArtist = (item: any) =>
    item.artists?.[0]?.name ||                      // Songs
    item.publisher ||                               // Podcasts
    item.attributes?.artistName ||                  // Apple Music
    item.narrator ||                                // Audiobooks
    item.snippet?.channelTitle ||                   // YouTube
    item.show?.publisher ||                         // Spotify podcast show
    "Unknown Artist";

  const getTitle = (item: any) =>
    item.name || item.snippet?.title || item.attributes?.name || "Untitled";

  const findNextPlayableIndex = (startIndex: number): number | null => {
    for (let i = startIndex + 1; i < songs.length; i++) {
      if (hasPreview(songs[i])) return i;
    }
    return null;
  };

  const findPreviousPlayableIndex = (startIndex: number): number | null => {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (hasPreview(songs[i])) return i;
    }
    return null;
  };

  const handlePlay = (item, index) => {
    const preview = getPreviewUrl(item);
    if (!preview) return;
    setPreviewUrl(preview);
    setActiveSong(item);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentIndex === null) return;
    const nextIndex = findNextPlayableIndex(currentIndex);
    if (nextIndex !== null) handlePlay(songs[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    if (currentIndex === null) return;
    const prevIndex = findPreviousPlayableIndex(currentIndex);
    if (prevIndex !== null) handlePlay(songs[prevIndex], prevIndex);
  };

  const handleDelete = async (indexToRemove: number) => {
    const updated = [...songs];
    updated.splice(indexToRemove, 1);
    setSongs(updated);
    if (parsed?.name) {
      const stored = await AsyncStorage.getItem("playlists");
      if (stored) {
        const playlists = JSON.parse(stored);
        const playlistIndex = playlists.findIndex(p => p.name === parsed.name);
        if (playlistIndex !== -1) {
          playlists[playlistIndex].songs = updated;
          await AsyncStorage.setItem("playlists", JSON.stringify(playlists));
        }
      }
    }
    if (currentIndex === indexToRemove) {
      setActiveSong(null);
      setPreviewUrl("");
      setCurrentIndex(null);
      setIsPlaying(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const imageUrl = getImageUrl(item);
    const artist = getArtist(item);
    const preview = getPreviewUrl(item);

    return (
      <View style={styles.songCard}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.songImage} />
        )}
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{getTitle(item)}</Text>
          <Text style={styles.songArtist}>{getArtist(item)}</Text>
        </View>

        {preview ? (
          <TouchableOpacity onPress={() => handlePlay(item, index)}>
            <Ionicons name="play-circle" size={28} color="#1DB954" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (item.external_urls?.spotify || item.attributes?.url) {
                Linking.openURL(item.external_urls?.spotify || item.attributes?.url);
              }
            }}
          >
            <Ionicons name="open-outline" size={24} color="#1DB954" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleDelete(index)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{parsed.name}</Text>
      </View>

      {songs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50 }}>No media in this playlist.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id || item.attributes?.url}
          renderItem={renderItem}
        />
      )}

      {previewUrl && activeSong && (
        <AudioPlayer
          previewUrl={previewUrl}
          songName={activeSong.name}
          artistName={getArtist(activeSong)}
          onClose={() => {
            setPreviewUrl("");
            setActiveSong(null);
            setIsPlaying(false);
            setCurrentIndex(null);
          }}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={handleNext}
          onPrevious={handlePrevious}
          disableNext={findNextPlayableIndex(currentIndex ?? -1) === null}
          disablePrevious={findPreviousPlayableIndex(currentIndex ?? songs.length) === null}
        />
      )}
    </SafeAreaView>
  );
};

export default PlaylistSongs;
