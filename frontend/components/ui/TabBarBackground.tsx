import { BlurView } from "expo-blur";
import { StyleSheet, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Modern tab bar arka planı
export default function TabBarBackground() {
  const insets = useSafeAreaInsets();

  // iOS için blur efektli şık tasarım
  if (Platform.OS === "ios") {
    return (
      <BlurView
        tint="light"
        intensity={90}
        style={[
          StyleSheet.absoluteFill,
          {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            borderTopWidth: 0.5,
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
            borderColor: "rgba(230, 230, 230, 0.5)",
          },
        ]}
      >
        {/* İlave iç glow efekti */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderWidth: 1,
              borderBottomWidth: 0,
              borderColor: "rgba(255, 255, 255, 0.8)",
            },
          ]}
        />
      </BlurView>
    );
  }

  // Android için şık arka plan
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
          elevation: 15,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "rgba(235, 235, 235, 0.8)",
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Hafif iç gölge efekti */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          right: 10,
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
