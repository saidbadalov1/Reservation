import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "../ThemedText";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="bg-white w-[90%] rounded-2xl p-4">
              <ThemedText
                weight="bold"
                className="text-xl text-typography-900 mb-2"
              >
                {title}
              </ThemedText>

              <ThemedText className="text-base text-typography-500 mb-6">
                {message}
              </ThemedText>

              <View className="flex-row gap-x-3">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200"
                >
                  <ThemedText
                    weight="medium"
                    className="text-center text-typography-900"
                  >
                    Ləğv et
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-1 py-3 rounded-xl bg-primary-500"
                >
                  <ThemedText
                    weight="medium"
                    className="text-center text-white"
                  >
                    Təsdiq et
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
