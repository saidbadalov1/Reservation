import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";

const ReservationTitle = () => {
  return (
    <View className="py-4" style={globalStyles.container}>
      <ThemedText weight="bold" className="text-xl font-bold">
        Rezervasiya etmək istədiyiniz tarixi və saatı seçin
      </ThemedText>

      <ThemedText className="text-sm text-gray-500 mt-2">
        Mövcud həkim cədvəlindən tarix və vaxtı seçə bilərsiniz
      </ThemedText>
    </View>
  );
};

export default ReservationTitle;
