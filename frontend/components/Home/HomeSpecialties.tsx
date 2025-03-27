import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useDispatch, useSelector } from "@/store/hooks";
import { fetchSpecialties } from "@/store/slices/specialties.slice";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { getSpecialtyIcon } from "@/utils/specialtyIcons";
import { setFilters } from "@/store/slices/filters.slice";
import { DoctorSpecialty } from "@/types/doctor.types";

const SpecialtyCard = ({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`py-4 px-6 rounded-xl mr-2 bg-white border border-gray-100`}
    style={{ minWidth: 110 }}
  >
    <View className="items-center mb-2">
      <View
        className={`w-14 h-14 rounded-full items-center justify-center bg-primary-50`}
      >
        {getSpecialtyIcon(name, 40, "#254EDB")}
      </View>
    </View>
    <ThemedText
      weight="medium"
      className={`text-sm text-center text-typography-900`}
    >
      {name}
    </ThemedText>
  </TouchableOpacity>
);

const HomeSpecialties = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.specialties);

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  if (loading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <View className="py-4">
      <View
        style={globalStyles.container}
        className="flex flex-row items-center justify-between"
      >
        <ThemedText weight="bold" className="text-lg text-typography-900">
          İxtisas seçin
        </ThemedText>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <ThemedText weight="medium" className="text-sm text-typography-500">
            Hamısı
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((specialty) => (
          <SpecialtyCard
            key={specialty}
            name={specialty}
            onPress={() => {
              dispatch(setFilters({ specialty: specialty as DoctorSpecialty }));
              router.push(`/search?specialty=${specialty}`);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeSpecialties;
