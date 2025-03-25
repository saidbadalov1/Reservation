import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import api from "@/services/api";
import { Header } from "@/components/ui/Header";
import { globalStyles } from "@/utils/globalStyles";

const DAYS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export default function DoctorSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [appointmentDuration, setAppointmentDuration] = useState("30");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get(`/doctor-settings`);
      console.log(response.data);
      setSettings(response.data);

      if (response.data?.appointmentDuration) {
        setAppointmentDuration(response.data.appointmentDuration.toString());
      }
    } catch (error) {
      console.error("Ayarlar alınırken hata:", error);
    }
  };

  const updateWorkingHours = async (
    dayOfWeek: number,
    isWorkingDay: boolean = true
  ) => {
    try {
      const workingHours =
        settings?.workingHours?.map((wh: any) =>
          wh.dayOfWeek === dayOfWeek
            ? {
                ...wh,
                startTime: format(startTime, "HH:mm"),
                endTime: format(endTime, "HH:mm"),
                isWorkingDay,
              }
            : wh
        ) || [];

      console.log("Gönderilen çalışma saatleri:", workingHours);
      const response = await api.put(`/doctor-settings/working-hours`, {
        workingHours,
      });
      console.log("API yanıtı:", response.data);

      fetchSettings();
    } catch (error) {
      console.error("Çalışma saatleri güncellenirken hata:", error);
    }
  };

  const updateAppointmentDuration = async () => {
    try {
      await api.put(`/doctor-settings/appointment-duration`, {
        duration: parseInt(appointmentDuration),
      });
      fetchSettings();
    } catch (error) {
      console.error("Randevu süresi güncellenirken hata:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header showBackButton title="Doktor Ayarları" />
      <ScrollView className="flex-1 ">
        <View style={globalStyles.container} className="py-4">
          <Text className="text-2xl font-bold mb-6">Doktor Ayarları</Text>

          {/* Randevu Süresi */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3">
              Randevu Süresi (Dakika)
            </Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-3"
                value={appointmentDuration}
                onChangeText={setAppointmentDuration}
                keyboardType="numeric"
              />
              <TouchableOpacity
                className="bg-blue-500 px-4 py-3 rounded-lg"
                onPress={updateAppointmentDuration}
              >
                <Text className="text-white font-semibold">Güncelle</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Çalışma Saatleri */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3">Çalışma Saatleri</Text>
            {DAYS.map((day, index) => (
              <View key={day} className="flex-row items-center mb-2">
                <TouchableOpacity
                  className="flex-1 flex-row justify-between bg-gray-100 p-3 rounded-lg mr-2"
                  onPress={() => {
                    setSelectedDay(index);
                    const workingHour = settings?.workingHours?.find(
                      (wh: any) => wh.dayOfWeek === index
                    );
                    if (workingHour) {
                      const [startHour, startMinute] =
                        workingHour.startTime.split(":");
                      const [endHour, endMinute] =
                        workingHour.endTime.split(":");
                      const start = new Date();
                      start.setHours(
                        parseInt(startHour),
                        parseInt(startMinute)
                      );
                      const end = new Date();
                      end.setHours(parseInt(endHour), parseInt(endMinute));
                      setStartTime(start);
                      setEndTime(end);
                    }
                  }}
                >
                  <Text className="font-medium">{day}</Text>
                  {settings?.workingHours?.find(
                    (wh: any) => wh.dayOfWeek === index
                  )?.isWorkingDay ? (
                    <Text className="text-gray-600">
                      {settings?.workingHours?.find(
                        (wh: any) => wh.dayOfWeek === index
                      )?.startTime || ""}{" "}
                      -{" "}
                      {settings?.workingHours?.find(
                        (wh: any) => wh.dayOfWeek === index
                      )?.endTime || ""}
                    </Text>
                  ) : (
                    <Text className="text-red-500">Kapalı</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-3 py-2 rounded-lg min-w-[60] items-center ${
                    settings?.workingHours?.find(
                      (wh: any) => wh.dayOfWeek === index
                    )?.isWorkingDay
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  onPress={() =>
                    updateWorkingHours(
                      index,
                      !settings?.workingHours?.find(
                        (wh: any) => wh.dayOfWeek === index
                      )?.isWorkingDay
                    )
                  }
                >
                  <Text className="text-white font-medium">
                    {settings?.workingHours?.find(
                      (wh: any) => wh.dayOfWeek === index
                    )?.isWorkingDay
                      ? "Kapat"
                      : "Aç"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Saat Seçiciler */}
          {selectedDay !== null && (
            <View className="mt-4 p-4 bg-gray-100 rounded-lg">
              <TouchableOpacity
                className="bg-white p-3 rounded-lg mb-2"
                onPress={() => setShowStartPicker(true)}
              >
                <Text className="text-center font-medium">
                  Başlangıç: {format(startTime, "HH:mm")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white p-3 rounded-lg mb-2"
                onPress={() => setShowEndPicker(true)}
              >
                <Text className="text-center font-medium">
                  Bitiş: {format(endTime, "HH:mm")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-500 p-3 rounded-lg mt-2"
                onPress={() => {
                  updateWorkingHours(selectedDay);
                  setSelectedDay(null);
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartTime(selectedDate);
                }
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndTime(selectedDate);
                }
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
