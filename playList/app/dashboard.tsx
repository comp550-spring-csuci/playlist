import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";
import TabNavigator from './TabNavigator';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard:React.FC = () => {
  const [fullName, setFullName] = useState("there");

  useEffect(() => {
      const fetchUserName = async () => {
        const name = await AsyncStorage.getItem("fullName");
        console.log("Fetched fullName from storage:", name);
        if (name) setFullName(name);
      };
      fetchUserName();
    }, []);
  const getGreeting = () => {
  	const hour = new Date().getHours();
  	const greeting =
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return `${greeting}${fullName ? ", " + fullName : ""}!`;
  };

  const tiles = [
    { title: "Songs", icon: "musical-notes", href: "/songs" },
    { title: "Podcasts", icon: "mic", href: "/podcasts" },
    { title: "Audiobooks", icon: "book", href: "/audiobooks" },
    { title: "Videos", icon: "videocam", href: "/videos" },
  ];

  return (
	<SafeAreaView style={styles.safeArea}>
      <View style={style.container}>
        {/* Header + Divider */}
              <View style={style.headerContainer}>
                <View style={style.header}>
                <Image
                  source={require("@/assets/images/myicon.png")}
                  style={style.icon}
                />
                  <Text style={style.headerText}>Dashboard</Text>
                </View>
                <View style={style.divider} />
              </View>
        {/*<Text style={styles.dashboardHeader}>Dashboard</Text>*/}
        <Text style={{ color: "grey", fontSize: 18 }}>{getGreeting()}</Text>
        <View style={styles.dashboardImage}>
          <Image source={require('../assets/images/playlist-logo.png')} style={{ width: 390, resizeMode: "contain" }} />
        </View>
        <View style={styles.tilesContainer}>
          {tiles.map((tile, index) => (
            <Link key={index} href={tile.href} asChild>
              <TouchableOpacity style={styles.tile} activeOpacity={0.8}>
                <Ionicons name={tile.icon} size={50} color="#fff" />
                <Text style={styles.tileText}>{tile.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
  </SafeAreaView>

  );
}

export default Dashboard;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    width:50,
    height: 50

  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#E0E8FF',
    borderWidth: 2,
    borderColor: '#00C853',
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
    height: 160,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: '#ccc',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
  },
  button: {
    backgroundColor:  '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 0.45,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});