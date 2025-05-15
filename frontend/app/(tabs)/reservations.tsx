import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Header } from "@/components/ui/Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { appointmentsApi, Appointment } from "@/services/appointments.services";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { SITE_URL } from "@/config";
import { router } from "expo-router";
import {
  setAppointments,
  updateAppointment,
} from "@/store/slices/appointmentsSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

export default function ReservationsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isDoctor = user?.role === "doctor";

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (isDoctor) {
        response = await appointmentsApi.getDoctorAppointments();
      } else {
        response = await appointmentsApi.getMyAppointments();
      }

      dispatch(setAppointments(response.appointments || []));
    } catch (err) {
      console.error("Rezervasiyaları yükləyərkən xəta:", err);
      setError("Rezervasiyaları yükləyərkən xəta baş verdi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      setActionLoading(appointmentId);
      await appointmentsApi.confirmAppointment(appointmentId);

      const updatedAppointment = appointments.find(
        (app) => app.id === appointmentId
      );
      if (updatedAppointment) {
        dispatch(
          updateAppointment({
            ...updatedAppointment,
            status: "confirmed" as const,
          })
        );
      }

      Alert.alert("Uğurlu", "Görüş təsdiqləndi");
    } catch (error) {
      console.error("Görüşü təsdiqləyərkən xəta:", error);
      Alert.alert("Xəta", "Görüşü təsdiqləyərkən xəta baş verdi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      setActionLoading(appointmentId);
      await appointmentsApi.rejectAppointment(appointmentId);

      const updatedAppointment = appointments.find(
        (app) => app.id === appointmentId
      );
      if (updatedAppointment) {
        dispatch(
          updateAppointment({
            ...updatedAppointment,
            status: "cancelled" as const,
          })
        );
      }

      Alert.alert("Uğurlu", "Görüş rədd edildi");
    } catch (error) {
      console.error("Görüşü rədd edərkən xəta:", error);
      Alert.alert("Xəta", "Görüşü rədd edərkən xəta baş verdi");
    } finally {
      setActionLoading(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, [isDoctor]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Təsdiqləndi";
      case "cancelled":
        return "Ləğv edildi";
      case "completed":
        return "Tamamlandı";
      case "pending":
      default:
        return "Gözləmədə";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      case "pending":
      default:
        return "bg-yellow-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

  const renderPersonInfo = (appointment: Appointment) => {
    if (isDoctor) {
      return (
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
            {appointment?.patient?.image ? (
              <Image
                source={{ uri: `${SITE_URL}${appointment.patient.image}` }}
                className="w-full h-full"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="person" size={24} color="#6b7280" />
              </View>
            )}
          </View>
          <View>
            <ThemedText className="text-base font-semibold">
              {appointment.patient?.name || "İsimsiz Hasta"}
            </ThemedText>
            <ThemedText className="text-sm text-gray-500">Xəstə</ThemedText>
          </View>
        </View>
      );
    } else {
      return (
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
            {appointment?.doctor?.image ? (
              <Image
                source={{ uri: `${SITE_URL}${appointment.doctor.image}` }}
                className="w-full h-full"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="person" size={24} color="#6b7280" />
              </View>
            )}
          </View>
          <View>
            <ThemedText className="text-base font-semibold">
              {appointment.doctor?.name}
            </ThemedText>
            <ThemedText className="text-sm text-gray-500">
              {appointment.doctor?.specialty}
            </ThemedText>
          </View>
        </View>
      );
    }
  };

  const renderAdditionalInfo = (appointment: Appointment) => {
    if (appointment.reason) {
      return (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <ThemedText className="text-sm font-medium mb-1">
            Görüş səbəbi:
          </ThemedText>
          <ThemedText className="text-sm text-gray-600">
            {appointment.reason}
          </ThemedText>
        </View>
      );
    }
    return null;
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <Header title={isDoctor ? "Xəstə Görüşləri" : "Rezervasiyalarım"} />

        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText className="mt-3 text-gray-500">
              Rezervasiyalar yüklənir...
            </ThemedText>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-5">
            <ThemedText className="text-red-500 text-center mb-4">
              {error}
            </ThemedText>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={fetchAppointments}
            >
              <ThemedText className="text-white font-semibold">
                Yenidən cəhd et
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : appointments.length === 0 ? (
          <View className="flex-1 items-center justify-center p-5">
            <ThemedText className="text-gray-500 text-center">
              {isDoctor
                ? "Hələ heç bir xəstə görüşü yoxdur."
                : "Hələ heç bir rezervasiyanız yoxdur."}
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            className="flex-1 "
            contentContainerStyle={[
              globalStyles.container,
              { paddingBottom: 100, paddingTop: 16 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#0a7ea4"]}
              />
            }
          >
            {appointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                onPress={() => router.push(`/reservations/${appointment.id}`)}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-center mb-3">
                  {renderPersonInfo(appointment)}
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    <ThemedText className="!text-white text-xs font-semibold">
                      {getStatusText(appointment?.status || "")}
                    </ThemedText>
                  </View>
                </View>

                <View className="space-y-2 border-t border-gray-100 pt-3">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <ThemedText className="ml-2 text-gray-600">
                      {formatDate(appointment?.date || "")}
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <ThemedText className="ml-2 text-gray-600">
                      {appointment?.time || ""}
                    </ThemedText>
                  </View>
                </View>

                {renderAdditionalInfo(appointment)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
