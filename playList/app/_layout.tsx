import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const RootLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false}}>
            //add a tabs route
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
};

export default RootLayout;
