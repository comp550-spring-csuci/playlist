"use client";
import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </View>
  );
}