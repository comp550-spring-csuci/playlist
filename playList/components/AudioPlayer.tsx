import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
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
const AudioPlayer = ({
  previewUrl,
  songName,
  artistName,
  onClose,
  onNext,
  onPrevious,
  disableNext,
  disablePrevious,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    playSound();
    return () => sound && sound.unloadAsync();
  }, [previewUrl]);

  const playSound = async () => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: previewUrl },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    setIsPlaying(true);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const position = status.positionMillis / status.durationMillis;
      setProgress(position);
      Animated.timing(progressAnim, {
        toValue: position,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Animated.View style={[styles.container, expanded && styles.expanded]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.songTitle} numberOfLines={1}>{songName}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
        </View>

        <TouchableOpacity style={styles.expandToggle} onPress={() => setExpanded(!expanded)}>
          <Ionicons name={expanded ? "chevron-down" : "chevron-up"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={onPrevious} disabled={disablePrevious}>
          <Ionicons name="play-skip-back" size={36} color={disablePrevious ? "#555" : "white"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={70} color="#1DB954" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onNext} disabled={disableNext}>
          <Ionicons name="play-skip-forward" size={36} color={disableNext ? "#555" : "white"} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, {
          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width - 40] })
        }]} />
      </View>
    </Animated.View>
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
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
  },
  expanded: {
    height: 260,
  },
  songInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
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
