import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { searchAppleMusicSongs } from '../services/appleService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/style';
import { Ionicons } from '@expo/vector-icons';
import MultiPlayer from '@/components/AudioPlayer';
import { Video } from 'expo-av';

//page designed to demonstrate appleService.ts functionality

const AppleTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');       //added for preview play
  const [selectedSong, setSelectedSong] = useState(null); //added for preview play


  const handleSearch = async () => {
    setLoading(true);
    const results = await searchAppleMusicSongs(searchQuery);
    setSongs(results || []);
    setLoading(false);
  };

  const handlePlayPreview = (song: any) => {             //added for preview play
    const preview = song.attributes?.previews?.[0]?.url;
    if (preview) {
      setPreviewUrl(preview);
      setSelectedSong(song);
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text style={styles.headerTitle}>Apple Music Song Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a song..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.songCard}>
              <Image
                source={{
                  uri: item.attributes?.artwork?.url.replace('{w}x{h}bb', '100x100bb'),
                }}
                style={styles.songImage}
              />
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.attributes?.name}</Text>
                <Text style={styles.songArtist}>{item.attributes?.artistName}</Text>
              </View>
              <TouchableOpacity onPress={() => handlePlayPreview(item)}>
                <Ionicons name="play-circle" size={28} color="#1DB954" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(item.attributes?.url)}>
                <Ionicons name="open-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {selectedSong && previewUrl && (
        <MultiPlayer
          previewUrl={previewUrl}
          songName={selectedSong.attributes?.name}
          artistName={selectedSong.attributes?.artistName}
          onClose={() => {
            setPreviewUrl('');
            setSelectedSong(null);
          }}
        />
      )}
    </SafeAreaView>
  );
  /*
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text style={styles.headerTitle}>Apple Music Song Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a song..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              //updated to allow for playing previews or opening url
              <View style={styles.songCard}>
                <Image
                  source={{
                    uri: item.attributes?.artwork?.url.replace('{w}x{h}bb', '100x100bb'),
                  }}
                  style={styles.songImage}
                />
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle}>{item.attributes?.name}</Text>
                  <Text style={styles.songArtist}>{item.attributes?.artistName}</Text>
                </View>
                <TouchableOpacity onPress={() => handlePlayPreview(item)}>
                  <Ionicons name="play-circle" size={28} color="#1DB954" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(item.attributes?.url)}>
                  <Ionicons name="open-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            
            *//* older code for opening songs in external url
            <TouchableOpacity
              onPress={() => Linking.openURL(item.attributes.url)}
              style={styles.songCard}
            >
            
              <Image source={{ uri: item.attributes?.artwork?.url.replace('{w}x{h}bb', '100x100bb') }} style={styles.songImage} />
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.attributes?.name}</Text>
                <Text style={styles.songArtist}>{item.attributes?.artistName}</Text>
              </View>
            
            </TouchableOpacity>
            *//*
          )}
        />
      )}

      {selectedSong && (                      //added for audioplayer functionality.
        <MultiPlayer
          previewUrl={previewUrl}
          songName={selectedSong.attributes.name}
          artistName={selectedSong.attributes.artistName}
          onClose={() => {
            setPreviewUrl('');
            setSelectedSong(null);
          }}
        />
      )}

    </SafeAreaView>
  );*/
  
  
};

export default AppleTest;
