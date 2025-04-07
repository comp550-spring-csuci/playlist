import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCategories} from "../services/spotifyService";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
//overview, lists out categories using fetchCategories from spotifyService.ts,
    //clicking category leads to dynamic page which will list playlists of that
    //category in the future.
const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            const categories = await fetchCategories();
            setCategories(categories);
        }
        loadCategories();
    }, []);

    return (
        //apologies for bad indentation, will fix later
        <SafeAreaView style={styles.safeAreaContainer}>
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Categoires</Text>
              </View>
              <FlatList
                      data={categories}
                      keyExtractor={(item) => item.name}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`/categories/${item.name}`)}>

                        <View style={styles.songCard}>
                            
                                <Image
                                    source={{ uri: item.icons[0]?.url }}
                                    style={styles.songImage}
                                />
                                <View style={styles.songDetails}>
                                    <Text style={styles.songTitle}>{item.name}</Text>
                                </View>
                            
                        </View>
                        </TouchableOpacity>
                      )}
                    />

                </SafeAreaView>
    );

}

export default Categories