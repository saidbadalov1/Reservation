import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import { DoctorDetailProps } from "./types";
import MapView, { Marker } from "react-native-maps";

const DoctorWorkLocation: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const initialRegion = {
    latitude: doctor?.location?.latitude ?? 40.3893, // Default to Baku coordinates
    longitude: doctor?.location?.longitude ?? 49.8474,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View className="py-4 border-b-8 border-gray-50">
      <View style={globalStyles.container} className="flex flex-col gap-y-4">
        <View className="flex flex-col gap-y-2">
          <ThemedText weight="bold" className="text-xl text-typography-900">
            İş yeri
          </ThemedText>
          <ThemedText className="text-sm text-typography-500">
            {doctor?.workAddress || "Səbail rayonu, Nizami küçəsi 203B"}
          </ThemedText>
        </View>

        {/* Map Container */}
        <View className="w-full h-[200px] rounded-xl overflow-hidden">
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={initialRegion}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              }}
            />
          </MapView>
        </View>
      </View>
    </View>
  );
};

export default DoctorWorkLocation;
