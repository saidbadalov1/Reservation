import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "@/components/NativeComponents/SafeAreaView";
import { Header } from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import ReservationTitle from "@/components/Reservation/ReservationTitle";
import ReservationChoose from "@/components/Reservation/CreateReservationForm";
import BottomButton from "@/components/ui/BottomButton";
import { ConfirmationModal } from "@/components/Modals/ConfirmationModal";
import { SuccessModal } from "@/components/Modals/SuccessModal";
import { useSelector, useDispatch } from "@/store/hooks";
import {
  setShowConfirmModal,
  resetReservation,
  setAvailableDates,
} from "@/store/slices/reservationSlice";
import { LoadingScreen } from "@/components/LoadingScreen";
import { fetchDoctor } from "@/store/slices/doctorSlice";
import { appointmentsApi } from "@/services/appointments.services";

const ReservationScreen = () => {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedDate, selectedTime, reason, showConfirmModal } = useSelector(
    (state) => state.reservation
  );
  const {
    currentDoctor: doctor,
    loading,
    error,
  } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (!params.id || typeof params.id !== "string") {
      return;
    }

    // Fetch doctor data
    if (!doctor) {
      dispatch(fetchDoctor(params.id));
    }

    // Fetch available dates when doctor data is loaded
    const fetchAvailableDates = async () => {
      if (!params.id || typeof params.id !== "string") {
        return;
      }
      try {
        const response = await appointmentsApi.getAvailableDates(params.id);

        // Format dates
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

        dispatch(setAvailableDates(dates));
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    if (doctor) {
      fetchAvailableDates();
    }

    return () => {
      dispatch(resetReservation());
    };
  }, [params.id, doctor, dispatch]);

  const formatDateForApi = (date: number) => {
    const currentDate = new Date();
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    return targetDate.toISOString().split("T")[0];
  };

  const handleConfirm = async () => {
    try {
      if (!doctor || !selectedDate || !selectedTime || !reason) {
        Alert.alert("Xəta", "Zəhmət olmasa bütün məlumatları doldurun");
        return;
      }

      setIsSubmitting(true);
      dispatch(setShowConfirmModal(false));

      const formattedDate = formatDateForApi(selectedDate);

      await appointmentsApi.createAppointment({
        doctorId: doctor.id,
        date: formattedDate,
        time: selectedTime,
        reason,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      }, 500);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Appointment creation error:", error);
      Alert.alert(
        "Xəta",
        error.response?.data?.message || "Rezervasiya sorğusu göndərilmədi"
      );
    }
  };

  const handleSuccessModalClose = () => {
    router.replace("/(tabs)");
  };

  const handleViewReservations = () => {
    router.replace("/(tabs)/reservations");
  };

  const getFormattedDateTime = () => {
    if (selectedDate && selectedTime) {
      const month = new Date().toLocaleString("az-AZ", { month: "long" });
      const year = new Date().getFullYear();
      return `${selectedDate} ${month} ${year}`;
    }
    return "";
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !doctor) {
    return (
      <View className="flex-1 items-center justify-center">
        <ThemedText weight="medium" className="text-red-500 text-lg">
          {error || "Həkim tapılmadı"}
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <Header
          title="Randevu al"
          showBackButton
          rightComponent={
            <Ionicons name="calendar-outline" size={24} color="black" />
          }
        />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ReservationTitle />
          <ReservationChoose />
        </ScrollView>
        <BottomButton
          title="Rezervasiya sorğusu göndər"
          onPress={() => !isSubmitting && dispatch(setShowConfirmModal(true))}
          disabled={!selectedDate || !selectedTime || !reason || isSubmitting}
        />
      </SafeAreaView>

      {showConfirmModal && (
        <ConfirmationModal
          visible={showConfirmModal}
          onClose={() => !isSubmitting && dispatch(setShowConfirmModal(false))}
          onConfirm={handleConfirm}
          title="Rezervasiya sorğusu göndər"
          message={`${
            doctor.name
          } həkimə ${getFormattedDateTime()}, ${selectedTime} tarixinə rezervasiya sorğusu göndərmək istədiyinizə əminsiniz?`}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
          onViewReservations={handleViewReservations}
          reservationDetails={{
            doctorName: doctor.name,
            date: getFormattedDateTime(),
            time: selectedTime || "",
            reason: reason,
          }}
          title="Rezervasiya sorğunuz göndərildi"
          message="Həkim rezervasiya sorğunuzu yoxladıqdan sonra təsdiqləyəcək və ya ləğv edəcək. Rezervasiyanızın vəziyyətini 'Rezervasiyalarım' bölməsindən izləyə bilərsiniz."
        />
      )}
    </View>
  );
};

export default ReservationScreen;
