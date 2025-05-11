import { Video } from "expo-av";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AudioPlayer = ({ previewUrl, songName, artistName, onClose }: any) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const loadSound = async () => {
      if (previewUrl) {
        const { sound } = await Audio.Sound.createAsync({ uri: previewUrl });
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [previewUrl]);

  return (
    <View style={styles.playerContainer}>
      <View style={styles.songInfo}>
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.artistName}>{artistName}</Text>
      </View>
      <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color="white" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1DB954",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
  songName: {
    color: "white",
    fontWeight: "bold",
  },
  artistName: {
    color: "white",
  },
});

export default AudioPlayer;
