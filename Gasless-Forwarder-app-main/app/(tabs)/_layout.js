import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000",
          paddingHorizontal: 20,
          paddingTop: 6,
          height: 64,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 5,
          marginTop: 2,
          color: "#fff",
        },
        tabBarActiveTintColor: "#8A2BE2",
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={28}
              color={focused ? "#8A2BE2" : "#fff"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book-outline"
              size={28}
              color={focused ? "#8A2BE2" : "#fff"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={28}
              color={focused ? "#8A2BE2" : "#fff"}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
