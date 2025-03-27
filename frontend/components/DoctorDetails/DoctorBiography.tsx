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
            <Ionicons name="school" size={22} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">
            Azerbaycan Tibb Universiteti
          </ThemedText>
        </View>

        {/* Experience */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <MaterialIcons name="work" size={22} color="#254EDB" />
          </View>
          <ThemedText className="text-typography-600 flex-1">
            15 il iş təcrübəsi
          </ThemedText>
        </View>

        {/* Previous Hospitals */}
        <View className="flex-row items-start gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <Ionicons name="medical" size={22} color="#254EDB" />
          </View>
          <View className="flex-1">
            <ThemedText className="text-typography-600 mb-1">
              Əvvəlki iş yerləri:
            </ThemedText>
            <View className="gap-y-1">
              <ThemedText className="text-typography-500">
                • Mərkəzi Klinika (2018-2023)
              </ThemedText>
              <ThemedText className="text-typography-500">
                • Baku Medical Plaza (2015-2018)
              </ThemedText>
              <ThemedText className="text-typography-500">
                • Memorial Klinika (2010-2015)
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Total Reservations */}
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center">
            <FontAwesome5 name="calendar-check" size={20} color="#254EDB" />
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
