import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={24}
      style={{
        marginBottom: -3,
        opacity: props.focused ? 1 : 0.5,
      }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#254EDB", // Figma active color
        tabBarInactiveTintColor: "#A1A1AA", // Figma inactive color
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          elevation: 0,
          position: "absolute",
          height: 60 + (Platform.OS === "ios" ? insets.bottom : 10),
        },
        tabBarLabelStyle: {
          fontFamily: "Manrope Medium",
          fontSize: 11,
          lineHeight: 20,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 8,
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Həkimlər",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="stethoscope" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Rezervasiyalar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="calendar" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
