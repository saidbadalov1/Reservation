import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor.types";
import { getDoctorById, getDoctorComments } from "@/services/doctors.services";

import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { LoadingScreen } from "@/components/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import { SITE_URL } from "@/config";
import { appointmentsApi } from "@/services/appointments.services";

interface AvailableDate {
  date: string;
  formattedDate: string;
  dayName: string;
  slots: TimeSlot[];
  appointmentDuration: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Comment {
  _id: string;
  comment: string;
  createdAt: string;
  patientId: {
    name: string;
    image?: string;
  };
}

export default function DoctorDetailScreen() {
  const params = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!params.id || typeof params.id !== "string") {
          setError("Həkim ID-si tapılmadı");
          setLoading(false);
          return;
        }

        const [doctorResponse, commentsResponse] = await Promise.all([
          getDoctorById(params.id),
          getDoctorComments(params.id),
        ]);

        setDoctor(doctorResponse.data);
        setComments(commentsResponse.data || []);
      } catch (error) {
        console.error(error);
        setError("Məlumatlar yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const openAppointmentModal = async () => {
    if (!doctor) return;

    setModalVisible(true);
    setLoadingDates(true);

    try {
      const response = await appointmentsApi.getAvailableDates(doctor.id);

      console.log(response.availableDates[1]);

      // Tarih bilgilerini format
      const dates = response.availableDates?.map((dateInfo: any) => {
        const date = new Date(dateInfo.date);
        const days = ["Baz", "B.e", "Ç.a", "Çər", "C.a", "Cüm", "Şən"];
        return {
          date: dateInfo.date,
          formattedDate: `${date.getDate().toString().padStart(2, "0")}.${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`,
          dayName: days[date.getDay()],
          slots: dateInfo.slots,
          appointmentDuration: dateInfo.appointmentDuration,
        };
      });

      setAvailableDates(dates);

      // Varsayılan olarak ilk tarihi seç
      if (dates?.length > 0) {
        handleDateSelect(dates[0].date);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Xəta", "Müsait tarixləri yükləyərkən xəta baş verdi");
      setModalVisible(false);
    } finally {
      setLoadingDates(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);

    // Bu tarih için saat dilimlerini bul
    const dateInfo = availableDates.find((d) => d.date === date);
    if (!dateInfo) return;

    setTimeSlots(dateInfo.slots);
  };

  const bookAppointment = async () => {
    if (!doctor || !selectedDate || !selectedTime || !reason) return;

    setBookingInProgress(true);

    try {
      await appointmentsApi.createAppointment({
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        reason,
      });

      setModalVisible(false);
      Alert.alert(
        "Uğurlu",
        "Görüş sorğunuz qəbul edildi. Təsdiq vəziyyətini rezervasiyalarım səhifəsindən izləyə bilərsiniz.",
        [
          {
            text: "Bağla",
            style: "cancel",
          },
          {
            text: "Rezervasiyalara get",
            onPress: () => router.push("/(tabs)/reservations"),
          },
        ]
      );
    } catch (error: any) {
      setBookingInProgress(false);
      Alert.alert(
        "Xəta",
        `Görüş yaradıla bilmədi: ${
          error.response?.data?.message || "Bir xəta baş verdi"
        }`
      );
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !doctor) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText className="text-red-500 text-lg">
          {error || "Həkim tapılmadı"}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <View className="relative">
        <View className="pt-12 rounded-br-full pb-2 bg-blue-500">
          <SafeAreaView>
            <View className="flex-row items-center px-4 py-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/50 items-center justify-center"
              >
                <Ionicons name="arrow-back" size={22} color="white" />
              </TouchableOpacity>
              <ThemedText className="flex-1 text-xl font-semibold text-center mr-10 !text-white">
                Həkim Məlumatları
              </ThemedText>
            </View>
          </SafeAreaView>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={globalStyles.container} className="px-4">
          <View className="items-center mt-10">
            <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center border-4 border-white shadow-md">
              <Image
                source={{ uri: SITE_URL + doctor.image }}
                width={100}
                height={100}
                className="w-full h-full rounded-full"
              />
            </View>
          </View>
          {/* Doctor info */}
          <View className="items-center mb-5">
            <ThemedText className="text-xl font-bold py-2 mb-1">
              {doctor.name}
            </ThemedText>
            <View className="bg-blue-50 px-3 rounded-full">
              <ThemedText className="text-lg text-blue-600 font-bold">
                {doctor.specialty}
              </ThemedText>
            </View>
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText className="ml-1">{doctor.rating || 0}</ThemedText>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={16} color="#0a7ea4" />
                <ThemedText className="ml-1">
                  {doctor.reviews || 0} şərh
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Contact details */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={16} color="#0a7ea4" />
              </View>
              <View>
                <ThemedText className="text-xs text-gray-500">Email</ThemedText>
                <ThemedText className="text-gray-700">
                  {doctor.email}
                </ThemedText>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="call-outline" size={16} color="#0a7ea4" />
              </View>
              <View>
                <ThemedText className="text-xs text-gray-500">
                  Telefon
                </ThemedText>
                <ThemedText className="text-gray-700">
                  {doctor.phone}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Comments section */}
          {doctor.reviews > 0 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-gray-100">
              <ThemedText className="text-lg font-bold mb-4">
                Həkim haqqında şərhlər ({doctor.reviews})
              </ThemedText>

              {comments.map((comment) => (
                <View
                  key={comment._id}
                  className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0"
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2">
                      {comment.patientId.image ? (
                        <Image
                          source={{ uri: SITE_URL + comment.patientId.image }}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <Ionicons name="person" size={16} color="#0a7ea4" />
                      )}
                    </View>
                    <View>
                      <ThemedText className="font-semibold">
                        {comment.patientId.name}
                      </ThemedText>
                      <ThemedText className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), "dd.MM.yyyy", {
                          locale: tr,
                        })}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText className="text-gray-600">
                    {comment.comment}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Book appointment button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-xl py-3 items-center shadow-sm mt-4 mb-6"
            activeOpacity={0.8}
            onPress={openAppointmentModal}
          >
            <ThemedText className="!text-white text-xl font-bold">
              Görüş Al
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Appointment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-5 h-4/5">
            {/* Modal header */}
            <View className="flex-row justify-between items-center mb-6">
              <ThemedText className="text-xl font-bold">Görüş Seç</ThemedText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {loadingDates ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0a7ea4" />
                <ThemedText className="mt-4 text-gray-600">
                  Müsait tarixlər yüklənir...
                </ThemedText>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Date selection */}
                <ThemedText className="text-base font-semibold mb-3">
                  Tarix seçin
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-6"
                >
                  {availableDates?.map((dateInfo) => (
                    <TouchableOpacity
                      key={dateInfo.date}
                      onPress={() => handleDateSelect(dateInfo.date)}
                      className={`mr-3 p-3 rounded-xl items-center min-w-16 ${
                        selectedDate === dateInfo.date
                          ? "bg-blue-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <ThemedText
                        className={`font-semibold ${
                          selectedDate === dateInfo.date
                            ? "!text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {dateInfo.dayName}
                      </ThemedText>
                      <ThemedText
                        className={`text-sm ${
                          selectedDate === dateInfo.date
                            ? "!text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {dateInfo.formattedDate}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Time selection */}
                {selectedDate && (
                  <>
                    <ThemedText className="text-base font-semibold mb-3">
                      Saat seçin
                    </ThemedText>
                    <View className="mb-4">
                      <ThemedText className="text-sm text-gray-500 mb-2">
                        Görüş müddəti:{" "}
                        {
                          availableDates.find((d) => d.date === selectedDate)
                            ?.appointmentDuration
                        }{" "}
                        dəqiqə
                      </ThemedText>
                    </View>
                    <View className="flex-row flex-wrap justify-between mb-4">
                      {timeSlots.map((slot) => (
                        <TouchableOpacity
                          key={slot.time}
                          onPress={() =>
                            slot.available && setSelectedTime(slot.time)
                          }
                          disabled={!slot.available}
                          className={`mb-3 p-3 rounded-xl items-center w-[30%] ${
                            selectedTime === slot.time
                              ? "bg-blue-500"
                              : slot.available
                              ? "bg-gray-100"
                              : "bg-gray-200"
                          }`}
                        >
                          <ThemedText
                            className={`${
                              selectedTime === slot.time
                                ? "!text-white"
                                : slot.available
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {slot.time}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Reason input */}
                    <View className="mb-4">
                      <ThemedText className="text-base font-semibold mb-2">
                        Görüş səbəbi
                      </ThemedText>
                      <TextInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Görüş səbəbini qeyd edin..."
                        multiline
                        numberOfLines={3}
                        className="bg-gray-100 p-3 rounded-xl text-gray-800"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </>
                )}

                {/* Confirm button */}
                <TouchableOpacity
                  className={`py-4 px-6 rounded-xl ${
                    !selectedDate ||
                    !selectedTime ||
                    !reason ||
                    bookingInProgress
                      ? "bg-gray-400"
                      : "bg-blue-500"
                  }`}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !reason ||
                    bookingInProgress
                  }
                  onPress={bookAppointment}
                >
                  <ThemedText className="!text-white text-xl text-center font-semibold">
                    Görüş Yarat
                  </ThemedText>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
