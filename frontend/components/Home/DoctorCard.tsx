import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";
import { Doctor } from "@/types/doctor.types";
import { SITE_URL } from "@/config";

interface DoctorCardProps {
  doctor: Doctor;
  onClose?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClose }) => {
  const handlePress = () => {
    if (onClose) {
      onClose();
    }
    router.push(`/doctor/${doctor.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-3xl p-4 mb-4 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: SITE_URL + doctor.image }}
        className="w-20 h-20 rounded-full"
        style={{ backgroundColor: "#f3f4f6" }}
      />
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <ThemedText className="font-bold" size="lg">
            {doctor.name}
          </ThemedText>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#fbbf24" />
            <ThemedText size="sm" className="ml-1 font-medium">
              {doctor.rating > 0 ? doctor.rating?.toFixed(2) : "yoxdur"}
            </ThemedText>
          </View>
        </View>
        <ThemedText size="sm" color="#6b7280" className="mt-1 font-medium">
          {doctor.specialty}
        </ThemedText>
        <View className="flex-row items-center justify-between mt-2">
          <ThemedText size="xs" color="#6b7280">
          {doctor.reviews ? `${doctor.reviews} rəy` : "rəy yoxdur"}
          </ThemedText>
          <View
            className={`px-2 py-1 rounded-full ${
              doctor.available ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <ThemedText
              size="xs"
              className="font-medium"
              color={doctor.available ? "#059669" : "#6b7280"}
            >
              {doctor.available ? "Müsaitdir" : "Məşğuldur"}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;
