import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

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
  container: {
    position: 'absolute',
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  songTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistName: {
    color: '#aaa',
    fontSize: 13,
  },
  expandToggle: {
    padding: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1DB954',
  },
});

export default AudioPlayer;
