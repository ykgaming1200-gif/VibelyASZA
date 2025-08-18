import { Tabs } from "expo-router";
import { Home, Search, Library, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.spotify.black }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.spotify.green,
          tabBarInactiveTintColor: colors.spotify.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.spotify.black,
            borderTopColor: colors.spotify.lightGray,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Your Library",
            tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}