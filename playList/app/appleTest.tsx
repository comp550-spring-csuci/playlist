import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { searchAppleMusicSongs } from '../services/appleService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/style';
//page designed to demonstrate appleService.ts functionality

const AppleTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const results = await searchAppleMusicSongs(searchQuery);
    setSongs(results || []);
    setLoading(false);
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
          )}
        />
      )}
    </SafeAreaView>
  );
  
  
};

export default AppleTest;
