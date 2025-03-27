import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { DoctorDetailProps } from "./types";
import { Ionicons } from "@expo/vector-icons";
import { SITE_URL } from "@/config";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import {
  doctorSettingsApi,
  DoctorSettings,
} from "@/services/doctor.settings.services";
import { tr } from "date-fns/locale";

const DAYS_OF_WEEK = [
  "Bazar",
  "Bazar ertəsi",
  "Çərşənbə axşamı",
  "Çərşənbə",
  "Cümə axşamı",
  "Cümə",
  "Şənbə",
];

const WorkingHoursItem = ({
  day,
  hours,
}: {
  day: string;
  hours: {
    isWorkingDay: boolean;
    startTime: string;
    endTime: string;
  };
}) => (
  <View className="flex-row justify-between items-center py-1">
    <ThemedText className="text-sm text-typography-500">{day}</ThemedText>
    <ThemedText className="text-sm text-typography-900">
      {hours.isWorkingDay
        ? `${hours.startTime} - ${hours.endTime}`
        : "Qeyri-iş günü"}
    </ThemedText>
  </View>
);

const DoctorInfo: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const [settings, setSettings] = useState<DoctorSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await doctorSettingsApi.getSettings(doctor.id);
        setSettings(response);
      } catch (error) {
        console.error("Həkimin iş saatlarını yükləyərkən xəta:", error);
      }
    };

    fetchSettings();
  }, [doctor.id]);



  return (
    <View className="py-4 border-b-8 border-gray-50">
      <View style={globalStyles.container} className="flex flex-col gap-y-4">
        {/* Header Info */}
        <View className="flex-row gap-x-3">
          {/* Doctor Image */}
          <View className="w-16 h-16 rounded-full items-center justify-center overflow-hidden">
            <Image
              source={{ uri: `${SITE_URL}${doctor.image}` }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Doctor Info */}
          <View className="flex-1 flex-col">
            <ThemedText
              weight="bold"
              className="text-xl text-typography-900 mb-1"
            >
              {doctor.name}
            </ThemedText>
            <ThemedText weight="medium" className="text-sm text-typography-500">
              {doctor.specialty}
            </ThemedText>
            <ThemedText
              weight="bold"
              className="text-base text-typography-900 mt-2"
            >
              {"Qiymət göstərilməyib"}
            </ThemedText>
          </View>
        </View>

        {/* Information Section */}
        <View className="flex-row mt-3">
          {/* Hospital Info */}
          <View className="flex-col items-center flex-1">
            <View className="flex-row items-center gap-x-2">
              <View className="w-10 h-10 bg-red-50 rounded-lg items-center justify-center">
                <Ionicons name="medical" size={24} color="#F04438" />
              </View>
              <ThemedText
                weight="medium"
                className="text-xs text-typography-500"
              >
                Xəstəxana
              </ThemedText>
            </View>
            <ThemedText
              weight="medium"
              className="text-sm text-typography-900 mt-2"
            >
              {"Məlumat yoxdur"}
            </ThemedText>
          </View>
        </View>

        <View className="mt-4">
          <ThemedText weight="bold" className="text-base text-typography-900">
            Həkimin iş qrafiki
          </ThemedText>
          {settings ? (
            <View className="bg-white rounded-lg py-4">
              {settings.workingHours.map((hours) => (
                <WorkingHoursItem
                  key={hours.dayOfWeek}
                  day={DAYS_OF_WEEK[hours.dayOfWeek]}
                  hours={hours}
                />
              ))}
            </View>
          ) : (
            <ThemedText className="text-sm text-typography-500">
              İş saatları haqqında məlumat yoxdur
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

export default DoctorInfo;
