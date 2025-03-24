import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Platform } from "react-native";
import React from "react";

export function HapticTab({
  accessibilityState,
  onPress,
  children,
  ...props
}: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const focused = accessibilityState?.selected;

  // Seçili duruma göre indikatör opaklığını ayarla
  React.useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused, opacity]);

  // Animasyon stilleri
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    // Önce ölçeği küçültüp sonra normale döndürerek animasyon etkisi oluştur
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);

    // Haptik geri bildirim - sadece iOS'ta
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Asıl tıklama işlevini çağır (undefined event parametresi ile)
    if (onPress) {
      onPress(undefined as any);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        },
        pressed && { opacity: 0.8 },
      ]}
      {...props}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={[
            animatedStyles,
            {
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}
