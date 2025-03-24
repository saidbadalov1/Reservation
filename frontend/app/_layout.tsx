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
import CheckAuth from "@/utils/CheckAuth";
import { useFonts } from "@/hooks/useFonts";
import { ActivityIndicator, View } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFonts();

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
          <CheckAuth />
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="doctor/[id]"
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
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
