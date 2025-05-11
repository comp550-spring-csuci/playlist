import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAppleMusicCharts } from '../services/appleService';
import { styles } from '@/styles/style';
//page designed to demonstrate appleService.ts functionality
const chartTypes = ['songs', 'albums', 'playlists', 'music-videos'];


const AppleTestCharts = () => {
    const [selectedType, setSelectedType] = useState('songs');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadChartData= async (type: string) =>{
        setLoading(true);
        const chartData = await fetchAppleMusicCharts(type, 15);
        setItems(chartData || []);
        setLoading(false);
    }

    useEffect(() => {
        loadChartData(selectedType);}, [selectedType]);
    
    const handleSelected = (type: string) => {
        if (type !== selectedType){
            setSelectedType(type);
        }
    };
    
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <Text style={styles.headerTitle}>Apple Music Top Charts</Text>

            <SafeAreaView style={{height: 25, flexDirection: 'row'}}>
            {chartTypes.map((type) => (
                <TouchableOpacity key={type} onPress={() => handleSelected(type)}>
                <Text>{type}  </Text>
                </TouchableOpacity>
            ))}
            </SafeAreaView>

        {loading ? (
            <ActivityIndicator size="large" color="#000" />
        ) : (
            <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => Linking.openURL(item.attributes?.url)} style={styles.songCard}>
                <Text>{index + 1}.</Text>
                {item.attributes?.artwork?.url && (<Image source={{ uri: item.attributes.artwork.url.replace('{w}x{h}bb', '100x100bb'), }}style={styles.songImage}/>)}
                <View style={styles.songDetails}>
                    <Text style={styles.songTitle}>{item.attributes?.name}</Text>
                    <Text style={styles.songArtist}>{item.attributes?.artistName || item.attributes?.curatorName}</Text>
                </View>
                </TouchableOpacity>
            )}/>
        )}
        </SafeAreaView>
    );
    };

export default AppleTestCharts;
