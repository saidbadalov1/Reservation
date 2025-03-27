import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewReservations: () => void;
  reservationDetails: {
    doctorName: string;
    date: string;
    time: string;
    reason: string;
  };
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onViewReservations,
  reservationDetails,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-[90%] rounded-2xl p-6">
          {/* Success Icon */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-2">
              <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
            </View>
            <ThemedText weight="bold" className="text-xl text-green-600">
              Rezervasiya təsdiqləndi!
            </ThemedText>
          </View>

          {/* Reservation Details */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <View className="mb-3">
              <ThemedText className="text-sm text-typography-500">
                Həkim
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.doctorName}
              </ThemedText>
            </View>

            <View className="mb-3">
              <ThemedText className="text-sm text-typography-500">
                Tarix və saat
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.date}, {reservationDetails.time}
              </ThemedText>
            </View>

            <View>
              <ThemedText className="text-sm text-typography-500">
                Görüş səbəbi
              </ThemedText>
              <ThemedText weight="medium" className="text-typography-900">
                {reservationDetails.reason}
              </ThemedText>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200"
            >
              <ThemedText
                weight="medium"
                className="text-center text-typography-900"
              >
                Bağla
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onViewReservations}
              className="flex-1 py-3 rounded-xl bg-primary-500"
            >
              <ThemedText weight="medium" className="text-center text-white">
                Rezervasiyalarım
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
