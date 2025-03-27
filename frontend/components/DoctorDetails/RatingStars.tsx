import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { FontAwesome } from "@expo/vector-icons";

interface RatingStarsProps {
  rating: number;
  showScore?: boolean;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  showScore = true,
  size = 16,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View className="flex-row items-center gap-x-2">
      <View className="flex-row">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <FontAwesome
                key={index}
                name="star"
                size={size}
                color="#F38744"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <FontAwesome
                key={index}
                name="star-half-o"
                size={size}
                color="#F38744"
              />
            );
          } else {
            return (
              <FontAwesome
                key={index}
                name="star-o"
                size={size}
                color="#F38744"
              />
            );
          }
        })}
      </View>
      {showScore && (
        <ThemedText className="text-sm text-typography-500">
          {rating.toFixed(1)}
        </ThemedText>
      )}
    </View>
  );
};
