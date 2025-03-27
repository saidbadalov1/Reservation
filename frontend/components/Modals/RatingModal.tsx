import React, { useState } from "react";
import { View, Modal, TouchableOpacity, TextInput } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  appointmentDetails: {
    doctorName: string;
    date: string;
    time: string;
  };
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  appointmentDetails,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View className="flex-row justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            disabled={isSubmitting}
          >
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={32}
              color={rating >= star ? "#FFD700" : "#9ca3af"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white w-full rounded-2xl p-4">
          <View className="items-center mb-6">
            <ThemedText
              weight="bold"
              className="text-xl text-typography-900 mb-2"
            >
              Rəyinizi bildirin
            </ThemedText>
            <ThemedText className="text-typography-500 text-center">
              {appointmentDetails.doctorName} həkimlə {appointmentDetails.date},{" "}
              {appointmentDetails.time} tarixli görüşünüzü dəyərləndirin
            </ThemedText>
          </View>

          {renderStars()}

          <View className="mt-6">
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Rəyinizi yazın..."
              multiline
              numberOfLines={4}
              className="bg-gray-100 p-4 rounded-xl text-typography-900"
              placeholderTextColor="#9ca3af"
              style={{ textAlignVertical: "top" }}
              editable={!isSubmitting}
            />
          </View>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-gray-100"
            >
              <ThemedText
                weight="bold"
                className="text-center text-typography-900"
              >
                Ləğv et
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={rating === 0 || !comment.trim() || isSubmitting}
              className={`flex-1 py-3 rounded-xl ${
                rating === 0 || !comment.trim() || isSubmitting
                  ? "bg-gray-300"
                  : "bg-primary-500"
              }`}
            >
              <ThemedText weight="bold" className="text-center text-white">
                {isSubmitting ? "Göndərilir..." : "Göndər"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
