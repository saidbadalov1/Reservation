import React, { useState, useCallback } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedRef,
  runOnJS,
} from "react-native-reanimated";
import { storage } from "@/services/storage.services";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Həkim seçimi",
    description: "İxtisasınıza uyğun həkim seçin",
    icon: "medical-outline",
  },
  {
    id: "2",
    title: "Online Rezervasiya",
    description: "Seçdiyiniz həkimlə online rezervasiya təyin edin",
    icon: "calendar-outline",
  },
  {
    id: "3",
    title: "Təcrübəli həkimlər",
    description: "Təcrübəli və peşəkar həkimlərimizlə tanış olun",
    icon: "people-outline",
  },
];

const SlideItem = ({
  item,
  index,
  scrollX,
}: {
  item: (typeof slides)[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      "clamp"
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      "clamp"
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, 20],
      "clamp"
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      "clamp"
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <Ionicons name={item.icon as any} size={80} color="#254EDB" />
      </Animated.View>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <ThemedText weight="bold" className="text-2xl text-center mb-2">
          {item.title}
        </ThemedText>
        <ThemedText className="text-base text-center text-gray-600">
          {item.description}
        </ThemedText>
      </Animated.View>
    </View>
  );
};

const PaginationDot = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      "clamp"
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      "clamp"
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const OnboardingSlider = ({ onFinish }: { onFinish: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<(typeof slides)[0]>>();

  const updateIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / width);
      runOnJS(updateIndex)(newIndex);
    },
  });

  const handleNext = useCallback(async () => {
    try {
      if (currentIndex < slides.length - 1) {
        await flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        await storage.setHasSeenOnboarding();
        onFinish();
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      await storage.setHasSeenOnboarding();
      onFinish();
    }
  }, [currentIndex, flatListRef, onFinish]);

  const handleSkip = useCallback(async () => {
    try {
      await storage.setHasSeenOnboarding();
      onFinish();
    } catch (error) {
      console.error("Error in handleSkip:", error);
      onFinish();
    }
  }, [onFinish]);

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof slides)[0]; index: number }) => (
      <SlideItem item={item} index={index} scrollX={scrollX} />
    ),
    [scrollX]
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={0}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <ThemedText weight="medium" className="text-primary-600">
              Keç
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <ThemedText weight="medium" className="text-white">
              {currentIndex === slides.length - 1 ? "Başla" : "Növbəti"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#254EDB",
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: 15,
  },
  nextButton: {
    backgroundColor: "#254EDB",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
});

export default OnboardingSlider;
