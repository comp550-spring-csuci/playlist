// 2. SongSearchScreen.js
// In this screen, the user can search for songs and add them to a selected playlist. We'll simulate a song search with some predefined songs.

import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const SongSearchScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [songs] = useState([
    { id: '1', title: 'Song 1' },
    { id: '2', title: 'Song 2' },
    { id: '3', title: 'Song 3' },
  ]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const addSongToPlaylist = (song) => {
    if (!selectedSongs.includes(song)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const savePlaylist = () => {
    playlist.songs = selectedSongs;
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{playlist.name}</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <Text>{item.title}</Text>
            <Button title="Add" onPress={() => addSongToPlaylist(item)} />
          </View>
        )}
      />
      <Button title="Save Playlist" onPress={savePlaylist} />
    </View>
  );
};

export default SongSearchScreen;
