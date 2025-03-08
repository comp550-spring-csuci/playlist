// 1. PlaylistScreen.js
// In this screen, the user will see a list of existing playlists and add new playlists. When a playlist is selected, it will take the user to the SongSearchScreen.

import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';

const PlaylistScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([{ name: 'Playlist 1', songs: [] }]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const addPlaylist = () => {
    if (newPlaylistName.trim()) {
      setPlaylists([...playlists, { name: newPlaylistName, songs: [] }]);
      setNewPlaylistName('');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>List of existing Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <Text>{item.name}</Text>
            <Button
              title="Add Song"
              onPress={() => navigation.navigate('SongSearch', { playlist: item })}
            />
          </View>
        )}
      />
      <TextInput
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
        placeholder="Click here to create new playlist"
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title="Add Playlist" onPress={addPlaylist} />
    </View>
  );
};

export default PlaylistScreen;
