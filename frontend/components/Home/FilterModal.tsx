import React from "react";
import { View, Modal, TouchableOpacity, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: "rating" | null;
  availabilityFilter: boolean | null;
  onSortChange: (value: "rating" | null) => void;
  onAvailabilityChange: (value: boolean | null) => void;
}

const FilterModal = ({
  visible,
  onClose,
  sortBy,
  availabilityFilter,
  onSortChange,
  onAvailabilityChange,
}: FilterModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
      animationType="slide"
    >
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <ThemedText size="xl" className="font-bold">
                Filtrlər
              </ThemedText>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Müsaitlik Filtresi */}
            <View className="mb-6">
              <ThemedText className="font-medium mb-3">Müsaitlik</ThemedText>
              <View className="flex-row gap-x-3">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center ${
                    availabilityFilter === null ? "bg-blue-500" : "bg-gray-100"
                  } px-4 py-3 rounded-xl`}
                  onPress={() => {
                    onAvailabilityChange(null);
                  }}
                >
                  <ThemedText
                    className="font-medium"
                    color={availabilityFilter === null ? "#ffffff" : "#374151"}
                  >
                    Hamısı
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center ${
                    availabilityFilter === true ? "bg-green-500" : "bg-gray-100"
                  } px-4 py-3 rounded-xl`}
                  onPress={() => {
                    onAvailabilityChange(true);
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={availabilityFilter === true ? "#ffffff" : "#374151"}
                  />
                  <ThemedText
                    className="ml-2 font-medium"
                    color={availabilityFilter === true ? "#ffffff" : "#374151"}
                  >
                    Müsait
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sıralama */}
            <View>
              <ThemedText className="font-medium mb-3">Sıralama</ThemedText>
              <View className="flex-row gap-x-3">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center ${
                    sortBy === null ? "bg-blue-500" : "bg-gray-100"
                  } px-4 py-3 rounded-xl`}
                  onPress={() => {
                    onSortChange(null);
                  }}
                >
                  <ThemedText
                    className="font-medium"
                    color={sortBy === null ? "#ffffff" : "#374151"}
                  >
                    Defolt
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center ${
                    sortBy === "rating" ? "bg-blue-500" : "bg-gray-100"
                  } px-4 py-3 rounded-xl`}
                  onPress={() => {
                    onSortChange("rating");
                  }}
                >
                  <Ionicons
                    name="star"
                    size={16}
                    color={sortBy === "rating" ? "#ffffff" : "#374151"}
                  />
                  <ThemedText
                    className="ml-2 font-medium"
                    color={sortBy === "rating" ? "#ffffff" : "#374151"}
                  >
                    Reytinq
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default FilterModal;
