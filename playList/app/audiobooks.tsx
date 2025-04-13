import React, { useState, useEffect } from "react"; 
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayListSearch from "./playListSearch";

const Audiobooks = () => {
  const audiobookData = [
    { id: '1', title: 'Audiobooks 1' },
    { id: '2', title: 'Audiobooks 2' },
    { id: '3', title: 'Audiobooks 3' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAudiobooks = audiobookData.filter((item) => {
     const title = item?.title || ""; 
	 return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: "#F5F5F5" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Audiobooks</Text>
        </View>
		
	  <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search audiobooks..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>
	  
	  {filteredAudiobooks.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
              No results found.
            </Text>
          </View>
      ) : (
        <FlatList
          data={filteredAudiobooks}
          keyExtractor={item => item.id}
		  renderItem={({ item }) => (
			<View style={styles.item}>
				<Text>{item.title}</Text> 
			</View>
		  )}
        />
	   )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Audiobooks;
