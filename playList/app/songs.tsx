
import { useEffect, useState } from "react";
import { View, Text, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Platform, Linking, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchSongs } from "../services/spotifyService";
import { fetchCategories} from "../services/spotifyService";
import usePaginatedData from "../hooks/usePaginatedData";
import { styles } from "@/styles/style";
import AudioPlayer from "@/components/AudioPlayer";
//0
import {searchAppleMusicSongs, fetchAppleMusicCharts} from "../services/appleService";
//import { importLyrics } from "../services/importLyrics";

const Songs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showFullName, setShowFullName] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeSong, setActiveSong] = useState<any | null>(null);
  const [lyricsModalVisible, setLyricsModalVisible] = useState(false);
  const [lyricsContent, setLyricsContent] = useState("");
  const [lyricsUrl, setLyricsUrl] = useState("");

  const {
      isFetchingMore,
      hasMore,
      fetchData: fetchMoreSongs,
    } = usePaginatedData(fetchSongs, 50);

  const [songs, setSongs] = useState<any[]>([]); //1
  const [isLoading,setisLoading] = useState<boolean>(true);//1

  const filteredSongs = songs.filter((item) =>
    //4
    item.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.attributes.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    //item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //item.artists[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentIndex = filteredSongs.findIndex(song => song.id === activeSong?.id);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < filteredSongs.length) {
      const nextSong = filteredSongs[nextIndex];
      setActiveSong(nextSong);
      setPreviewUrl(nextSong.attributes.previews?.[0]?.url || "");
    }
  };

const handlePrevious = () => {
  const prevIndex = currentIndex - 1;
  if (prevIndex >= 0) {
    const prevSong = filteredSongs[prevIndex];
    setActiveSong(prevSong);
    setPreviewUrl(prevSong.attributes.previews?.[0]?.url || "");
  }
};


  useEffect(() => {
  const loadPlaylistsFromStorage = async () => {
    const storedPlaylists = await AsyncStorage.getItem("playlists");
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  };
  loadPlaylistsFromStorage();
    }, []);

  useEffect(() => {
      async function loadCategories() {
          const categories = await fetchCategories();
          setCategories(categories);
      }
      loadCategories();
  }, []);

  //2 Loads top charts if no search input, replaces with searched on input
  useEffect(() =>{
    if (searchQuery.length ==0){
      setisLoading(true);
      fetchAppleMusicCharts("songs",25).then((chart) =>{
        setSongs(chart);
        setisLoading(false);
      });
    } else {
      setisLoading(true);
      searchAppleMusicSongs(searchQuery, 25).then((results) => {
        setSongs(results);
        setisLoading(false);
      });
    }
  }, [searchQuery]);
  //2 end


  const openModal = (song: any) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSong(null);
  };
  const savePlaylists = async (updatedPlaylists: any[]) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
  };

  const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: newPlaylistName,
      songs: [selectedSong],
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    savePlaylists(updatedPlaylists);
    setNewPlaylistModalVisible(false);
    setNewPlaylistName("");
    closeModal();
    router.push("/playlist");
  };

  const toggleName = () => {
       setShowFullName(!showFullName);
     };
	 
  const handleLyricsPress = async (artist: string, title: string) => {
	const result = encodeURIComponent(`${artist} ${title}`);
	const geniusUrl = `https://genius.com/search?q=${result}`

	if (Platform.OS === "web") {
		window.open(geniusUrl, "_blank");
	} else {
		setLyricsContent("View full lyrics on Genius.");
		setLyricsUrl(geniusUrl);
		setLyricsModalVisible(true);
	}
  };

	if (songs.length === 0 && !isFetchingMore) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      );
    }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/AppTabs")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Songs</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search songs..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: "bold" }}>Top Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() =>
                router.push({
                  pathname: `/categories/${item.name}`,
                })
              }
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: item.icons[0]?.url }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
                <Text
                  style={{ maxWidth: 100, textAlign: "center", marginTop: 5 }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>


       {filteredSongs.length === 0 ? (
         <View style={{ padding: 20 }}>
               <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
                       No results found.
               </Text>
         </View>
       ) : (

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songCard}>
            <Image
              //3
              source = {{uri : item.attributes.artwork.url.replace("{w}","100").replace("{h}","100")}}
              //source={{ uri: item.album.images[0].url }}
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>
                {showFullName
                    ? item.attributes.name
                    : `${item.attributes.name.slice(0, 25)}${item.attributes.name.length > 25 ? "..." : ""}`}
              </Text>
              <Text style={styles.songArtist}>
                
                {showFullName
                    ? item.attributes.artistName
                    : `${item.attributes.artistName.slice(0, 25)}${item.attributes.artistName.length > 25 ? "..." : ""}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
              //3
              setPreviewUrl(item.attributes.previews?.[0]?.url);
              //setPreviewUrl(item.preview_url);
              setActiveSong(item);
            }}
            >
              <Ionicons name="play-circle" size={28} color="#1DB954" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal(item)}
            >
              <Ionicons name="add-circle" size={28} color="#1DB954" />
            </TouchableOpacity>
			<TouchableOpacity 
			  onPress={() => handleLyricsPress(item.attributes.artistName, item.attributes.name)}
			>
			  <Ionicons name="document-text" size={24} color="#1DB954" />
			</TouchableOpacity>
          </View>
        )}
        onEndReached={hasMore ? fetchMoreSongs : null}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="#1DB954" />
          ) : !hasMore ? (
            <Text style={{ textAlign: "center", padding: 10, color: "gray" }}>
              No more songs
            </Text>
          ) : null
        }
      />
    )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ADD TO</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // TODO: Add to Existing Playlist
                closeModal();
                router.push({
                    pathname: "/playlist",
                    params: {
                      songToAdd: JSON.stringify(selectedSong), // Serialize for navigation
                    },
                  });
              }}
            >
              <Text style={styles.modalButtonText}>Existing Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
            setModalVisible(false);
            setNewPlaylistModalVisible(true);
                }}
            >
  <Text style={styles.modalButtonText}>New Playlist</Text>
    </TouchableOpacity>

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
  transparent={true}
  visible={newPlaylistModalVisible}
  animationType="slide"
  onRequestClose={() => setNewPlaylistModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Create New Playlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Playlist Name"
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
      />
      <TouchableOpacity style={styles.modalButton} onPress={handleCreatePlaylist}>
        <Text style={styles.modalButtonText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setNewPlaylistModalVisible(false)}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
 
  </Modal>
  
  {/* Lyrics Modal */}
      <Modal transparent visible={lyricsModalVisible} animationType="slide" onRequestClose={() => setLyricsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lyrics</Text>
            {lyricsUrl ? (
              <TouchableOpacity onPress={() => Linking.openURL(lyricsUrl)}>
                <Text style={{ color: "#1DB954", textAlign: "center" }}>Open in Genius</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ maxHeight: 300, marginVertical: 10 }}>{lyricsContent}</Text>
            )}
            <TouchableOpacity onPress={() => setLyricsModalVisible(false)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    {previewUrl && activeSong && (
      <AudioPlayer
        previewUrl={previewUrl}
        songName={activeSong.attributes.name}
        artistName={activeSong.attributes.artistName}
        onClose={() => {
          setPreviewUrl("");
          setActiveSong(null);
        }}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    )}
    </SafeAreaView>
  );
};

export default Songs;
