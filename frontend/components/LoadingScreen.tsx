import { ActivityIndicator } from "react-native";
import { ThemedView } from "./ThemedView";

export const LoadingScreen = () => {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#0066FF" />
    </ThemedView>
  );
};
