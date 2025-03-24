/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Theme } from "@react-navigation/native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: "#3b82f6",
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    border: "#e5e7eb",
    notification: "#ef4444",
  },
  fonts: {
    regular: {
      fontFamily: "Poppins-Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Poppins-Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "Poppins-SemiBold",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "Poppins-Bold",
      fontWeight: "700",
    },
  },
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#60a5fa",
    background: "#1f2937",
    card: "#374151",
    text: "#ffffff",
    border: "#4b5563",
    notification: "#f87171",
  },
  fonts: {
    regular: {
      fontFamily: "Poppins-Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Poppins-Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "Poppins-SemiBold",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "Poppins-Bold",
      fontWeight: "700",
    },
  },
};
