import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface ReservationDetails {
  doctorName: string;
  date: string;
  time: string;
  reason: string;
}

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewReservations: () => void;
  reservationDetails: ReservationDetails;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onViewReservations,
  reservationDetails,
  title,
  message,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white w-full rounded-2xl p-4">
          {/* Success Icon */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-2">
              <Ionicons name="checkmark" size={32} color="#22c55e" />
            </View>
            <ThemedText weight="bold" className="text-xl text-typography-900">
              {title}
            </ThemedText>
          </View>

          {/* Message */}
          <ThemedText
            weight="medium"
            className="text-typography-500 text-center mb-6"
          >
            {message}
          </ThemedText>

          {/* Reservation Details */}
          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <View className="flex-row justify-between mb-2">
              <ThemedText weight="medium" className="text-typography-500">
                Həkim
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.doctorName}
              </ThemedText>
            </View>
            <View className="flex-row justify-between mb-2">
              <ThemedText weight="medium" className="text-typography-500">
                Tarix
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.date}
              </ThemedText>
            </View>
            <View className="flex-row justify-between mb-2">
              <ThemedText weight="medium" className="text-typography-500">
                Saat
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.time}
              </ThemedText>
            </View>
            <View className="flex-row justify-between">
              <ThemedText weight="medium" className="text-typography-500">
                Səbəb
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.reason}
              </ThemedText>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100"
            >
              <ThemedText
                weight="bold"
                className="text-center text-typography-900"
              >
                Bağla
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onViewReservations}
              className="flex-1 py-3 rounded-xl bg-primary-500"
            >
              <ThemedText weight="bold" className="text-center text-white">
                Rezervasiyalarım
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
