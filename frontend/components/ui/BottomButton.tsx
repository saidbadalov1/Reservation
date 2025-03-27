import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const BottomButton: React.FC<BottomButtonProps> = ({
  title,
  onPress,
  disabled,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[globalStyles.container, { paddingBottom: insets.bottom }]}
      className="bg-white border-t border-gray-200 pt-4 flex-row gap-x-4"
    >
      {/* Make Appointment Button */}
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 h-12 bg-primary-500 rounded-lg items-center justify-center"
        style={{ elevation: 1 }}
        disabled={disabled}
      >
        <ThemedText weight="bold" className="text-white">
          {title}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButton;
