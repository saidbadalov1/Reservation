import { useEffect, useState } from "react";
import * as Font from "expo-font";

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
          "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
          "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
          "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Font yükleme xətası:", error);
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};
