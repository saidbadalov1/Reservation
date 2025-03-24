import React, { useState } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor.types";
import DoctorCard from "./DoctorCard";
import { searchDoctors } from "@/services/doctors.services";
import debounce from "lodash/debounce";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const SearchModal = ({ visible, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  const handleSearch = debounce(async (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredDoctors([]);
      return;
    }

    try {
      setIsLoading(true);
      const doctors = await searchDoctors(text);
      setFilteredDoctors(doctors);
    } catch (error) {
      console.error("Arama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
      animationType="fade"
    >
      <View className="flex-1 bg-blue-500">
        {/* Close Button */}

        <View className="flex-1 pt-14">
          {/* Search Header */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-white text-2xl font-bold"></ThemedText>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-white/90 backdrop-blur-lg rounded-2xl">
              <TextInput
                className="flex-1 px-4 py-4 text-gray-900"
                placeholder="Həkim və ya ixtisas axtar"
                placeholderTextColor="#6b7280"
                defaultValue={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {isLoading ? (
                <View className="px-4">
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : searchQuery ? (
                <TouchableOpacity
                  className="px-4"
                  onPress={() => handleSearch("")}
                >
                  <Ionicons name="close-circle" size={20} color="#6b7280" />
                </TouchableOpacity>
              ) : (
                <View className="px-4">
                  <Ionicons name="search-outline" size={20} color="#6b7280" />
                </View>
              )}
            </View>
          </View>

          {/* Search Results */}
          {searchQuery ? (
            <FlatList
              data={filteredDoctors}
              renderItem={({ item }) => (
                <DoctorCard onClose={onClose} doctor={item} />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 24,
              }}
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-8">
                  <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color="#ffffff"
                  />
                  <ThemedText className="text-center mt-4" color="#ffffff">
                    {isLoading ? "Axtarılır..." : "Heç bir həkim tapılmadı"}
                  </ThemedText>
                </View>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="search" size={48} color="#ffffff" />
              <ThemedText className="text-center mt-4" color="#ffffff">
                Həkim və ya ixtisas axtarın
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;
