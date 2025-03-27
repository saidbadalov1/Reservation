import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import { RatingStars } from "./RatingStars";
import { DoctorDetailProps } from "./types";
import { formatRelativeDate } from "@/utils/dateUtils";
import { ratingsApi } from "@/services/ratings.services";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { SITE_URL } from "@/config";

interface ReviewItemProps {
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  userName,
  userImage,
  rating,
  comment,
  date,
}) => {
  const sensuredUserName = userName.slice(0, 3) + "***";
  const formattedDate = formatRelativeDate(date);

  return (
    <View className="flex-row gap-x-3 py-3">
      {/* User Image */}
      <View className="w-10 h-10 rounded-full overflow-hidden border border-primary-100 bg-primary-50">
        {userImage ? (
          <Image
            source={{ uri: `${SITE_URL}${userImage}` }}
            className="w-full h-full"
            resizeMode="cover"
            blurRadius={10}
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <FontAwesome name="user" size={24} color="#6b7280" />
          </View>
        )}
      </View>

      {/* Review Content */}
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-1">
          <ThemedText weight="bold" className="text-base text-typography-900">
            {sensuredUserName}
          </ThemedText>
          <ThemedText className="text-xs text-typography-500">
            {formattedDate}
          </ThemedText>
        </View>

        {/* Rating */}
        <RatingStars rating={rating} size={14} />

        {/* Comment */}
        <ThemedText className="text-sm text-typography-500 mt-1">
          {comment}
        </ThemedText>
      </View>
    </View>
  );
};

const DoctorRatings: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<{
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      userName: string;
      userImage?: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  } | null>(null);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await ratingsApi.getDoctorRatings(doctor.id);
      setRatings(response);
    } catch (error) {
      console.error("Rəyləri yükləyərkən xəta baş verdi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [doctor.id]);

  if (loading) {
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!ratings || ratings.reviews.length === 0) {
    return (
      <View className="py-4">
        <View style={globalStyles.container}>
          <ThemedText className="text-center text-typography-500">
            Bu həkim üçün hələ rəy yazılmayıb
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View className="py-4">
      <View style={globalStyles.container} className="flex flex-col">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText weight="bold" className="text-xl text-typography-900">
            Rəylər ({ratings.totalReviews})
          </ThemedText>
          <View className="flex-row items-center gap-x-2">
            <RatingStars rating={ratings.averageRating} size={16} />
          </View>
        </View>

        {/* Reviews List */}
        <View className="divide-y divide-gray-100">
          {ratings.reviews.map((review) => (
            <ReviewItem
              key={review.id}
              userName={review.userName}
              userImage={review.userImage}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default DoctorRatings;
