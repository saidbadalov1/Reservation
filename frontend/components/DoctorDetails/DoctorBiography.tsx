import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { DoctorDetailProps } from "./types";

const DoctorBiography: React.FC<DoctorDetailProps> = ({ doctor }) => {
  return (
    <View className="py-4 border-b-8 border-gray-50">
      <View style={globalStyles.container} className="flex flex-col gap-y-4">
        <ThemedText weight="bold" className="text-xl text-typography-900 mb-1">
          {"Həkim haqqında"}
        </ThemedText>

        {/* Gender */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <Ionicons name="male" size={24} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">Kişi</ThemedText>
        </View>

        {/* University */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <Ionicons name="school" size={24} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">
            Azerbaycan Tibb Universiteti
          </ThemedText>
        </View>

        {/* Experience */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <MaterialIcons name="work" size={24} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">
            15 il iş təcrübəsi
          </ThemedText>
        </View>

        {/* Language */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <MaterialIcons name="language" size={24} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">
            Azərbaycan dili, Türk dili, İngilis dili, Rus dili
          </ThemedText>
        </View>

        {/* Total Reservations */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <FontAwesome5 name="calendar-check" size={24} color="#254EDB" />
          </View>
          <ThemedText className="text-gray-600 flex-1">
            2,500+ tamamlanmış rezervasiya
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default DoctorBiography;
