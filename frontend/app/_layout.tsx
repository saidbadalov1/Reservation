import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, View } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import OnboardingWrapper from "@/components/Onboarding/OnboardingWrapper";
import AuthWrapper from "@/components/Auth/AuthWrapper";
import { storage } from "@/services/storage.services";

export default function Layout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-Bold": Manrope_700Bold,
    "Manrope-ExtraBold": Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <OnboardingWrapper>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="doctor/[id]/index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="notifications"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="reservations/[id]"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="doctor/settings"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="doctor/[id]/reservation"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="search" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </OnboardingWrapper>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
