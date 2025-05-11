import { Audio, ResizeMode, Video } from "expo-av";
import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const isVideoFile = (url:string) => {
  return /\.(mp4|mov|m4v)(\?.*)?$/.test(url);
}

const MultiPlayer = ({previewUrl, songName, artistName, onClose}:any) =>{
  const [sound,setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying,setIsPlaying] = useState(false);
  const videoRef = useRef<Video | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!previewUrl || isVideoFile(previewUrl)) return;
      const {sound} = await Audio.Sound.createAsync({uri:previewUrl});
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
      
    };

    load();

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [previewUrl]);

  const toggleAudio = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleVideo = async () => {
    if (!videoRef.current) return;
    const status = await videoRef.current.getStatusAsync();
    if (status) {//potential error point
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true)
    }
  };

  return (
    <View  style={styles.playerContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.artistName}>{artistName}</Text>
      </View>

      {isVideoFile(previewUrl) ? ( //compressed video presentation, may need to be altered in style
        <View style={{ flex: 1 }}>
          <Video
            ref={videoRef}
            source={{ uri: previewUrl }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            //resizeMode="contain"
            shouldPlay
            onPlaybackStatusUpdate={(status) => setIsPlaying(isPlaying)}
          />
          <TouchableOpacity onPress={toggleVideo}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={toggleAudio}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color="white" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
);
  

};
/*
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
*/
const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: "#1DB954",
    padding: 30,
    width: "100%",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 0,
  },
  infoContainer: {
    marginBottom: 10,
  },
  songName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  artistName: {
    color: "white",
    fontSize: 14,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});


/*
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
*/
export default MultiPlayer;
