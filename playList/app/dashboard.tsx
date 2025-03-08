import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/styles/style";

const Dashboard = () => {
  const tiles = [
    { title: "Songs", icon: "musical-notes", href: "/songs" },
    { title: "Podcasts", icon: "mic", href: "/podcasts" },
    { title: "Audiobooks", icon: "book", href: "/audiobooks" },
    { title: "Videos", icon: "videocam", href: "/videos" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.overlay}>
        <Text style={styles.dashboardHeader}>Dashboard</Text>
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
};

export default Dashboard;
