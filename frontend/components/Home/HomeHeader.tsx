import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

const HomeHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        globalStyles.container,
        {
          paddingTop: insets.top + 10,
          gap: 16,
        },
      ]}
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between">
        {/* Left Side - Text */}
        <View>
          <ThemedText weight="bold" size="xl" className="text-black">
            👋 Salam {user?.name}
          </ThemedText>
          <ThemedText weight="medium" size="sm" className="text-typography-700">
            Ümid edirəm ki, hər şey yaxşıdır🙏🏻
          </ThemedText>
        </View>

        {/* Right Side - Notification */}
        <TouchableOpacity
          className="bg-gray-50 rounded-lg items-center justify-center border border-gray-50 p-1.5 "
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={20} color="#18181B" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View className="flex-row items-center space-x-2">
        {/* Search Input */}
        <TouchableOpacity
          onPress={() => router.push("/search")}
          className="flex-1 flex-row items-center bg-white border border-gray-300 rounded-xl p-3 gap-3"
        >
          <View>
            <Ionicons name="search-outline" size={20} color="#6C737F" />
          </View>
          <ThemedText weight="medium" className="flex-1 text-gray-500">
            Həkimi tap
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
