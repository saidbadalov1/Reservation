import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { Doctor } from "@/types/doctor.types";
import { SITE_URL } from "@/config";
import { router } from "expo-router";

interface SearchDoctorCardProps {
  doctor: Doctor;
}

const SearchDoctorCard: React.FC<SearchDoctorCardProps> = ({ doctor }) => {
  const { image, name, specialty, rating } = doctor;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/doctor/${doctor.id}`);
      }}
      activeOpacity={0.5}
      className="flex-row items-center py-4 bg-white gap-3 border-b border-gray-100 px-4"
    >
      {/* Doctor Image */}
      <View className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 overflow-hidden">
        <Image
          source={{
            uri: `https://c8.alamy.com/comp/2E4WTPW/cartoon-character-3d-avatar-middle-age-smiling-caucasian-male-professional-doctor-isolated-on-white-2E4WTPW.jpg`,
          }}
          className="w-full h-full "
          resizeMode="cover"
        />
      </View>

      {/* Doctor Info */}
      <View className="flex-1 flex flex-row justify-between items-start">
        <View className="flex-col">
          <ThemedText weight="bold" className="text-lg ">
            {name}
          </ThemedText>
          <ThemedText
            weight="medium"
            className="text-sm text-typography-500 mb-1"
          >
            {specialty}
          </ThemedText>
        </View>
        {/* Rating */}
        <View className="flex-row items-center gap-2">
          <FontAwesome name="star" size={16} color="#F38744" />
          <ThemedText className="text-xs text-typography-500 font-medium">
            {rating ? rating.toFixed(1) : "yoxdur"}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchDoctorCard;
