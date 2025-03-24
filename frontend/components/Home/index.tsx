import React, { useEffect, useCallback, useRef } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import DoctorCard from "./DoctorCard";
import FilterModal from "./FilterModal";
import {
  fetchDoctors,
  fetchSpecialties,
  setSelectedSpecialty,
  setSortBy,
  setAvailabilityFilter,
  setIsLoading,
} from "@/store/slices/doctorsSlice";
import { Doctor } from "@/types/doctor.types";
import SearchModal from "./SearchModal";
import { router } from "expo-router";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    doctors,
    specialties,
    selectedSpecialty,
    isLoading,
    pagination,
    sortBy,
    availabilityFilter,
  } = useSelector((state: RootState) => state.doctors);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = React.useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        dispatch(fetchSpecialties()),
        dispatch(
          fetchDoctors({
            specialty: selectedSpecialty,
            page: 1,
            limit: ITEMS_PER_PAGE,
          })
        ),
      ]);
      setIsInitialLoading(false);
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialLoading) {
      dispatch(setIsLoading(true));
      setCurrentPage(1);
      dispatch(
        fetchDoctors({
          specialty: selectedSpecialty,
          page: 1,
          limit: ITEMS_PER_PAGE,
          sort: sortBy || undefined,
          available: availabilityFilter ?? undefined,
        })
      );
    }
  }, [
    dispatch,
    selectedSpecialty,
    isInitialLoading,
    sortBy,
    availabilityFilter,
  ]);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination?.hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(
        fetchDoctors({
          specialty: selectedSpecialty,
          page: nextPage,
          limit: ITEMS_PER_PAGE,
          sort: sortBy || undefined,
          available: availabilityFilter ?? undefined,
        })
      );
    }
  }, [
    dispatch,
    currentPage,
    isLoading,
    pagination,
    selectedSpecialty,
    sortBy,
    availabilityFilter,
  ]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [190, 120],
    extrapolate: "clamp",
  });

  const headerPadding = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [24, 16],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [24, 20],
    extrapolate: "clamp",
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [90, 0],
    extrapolate: "clamp",
  });

  const renderHeader = useCallback(() => {
    return (
      <>
        {/* Categories */}
        <View className="mb-6">
          <View style={globalStyles.container}>
            <ThemedText size="xl" className="my-4 font-bold">
              İxtisaslar ({specialties.length})
            </ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                className={`px-6 py-3 rounded-xl mr-3 ${
                  specialty === selectedSpecialty
                    ? "bg-blue-500"
                    : "bg-gray-100"
                } ${index === specialties.length - 1 && "mr-4"} ${
                  index === 0 && "ml-4"
                }`}
                onPress={() => dispatch(setSelectedSpecialty(specialty))}
              >
                <ThemedText
                  className={`font-medium `}
                  color={
                    specialty === selectedSpecialty ? "#ffffff" : "#374151"
                  }
                >
                  {specialty}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List Header */}
        <View style={globalStyles.container}>
          <View className="flex-row items-center justify-between mb-4">
            <ThemedText size="xl" className="font-bold">
              Həkimlər {!isLoading && `(${pagination?.total || 0})`}
            </ThemedText>
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl"
              onPress={() => setIsFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={16} color="#374151" />
              <ThemedText className="ml-2 font-medium" color="#374151">
                Filtrlər
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }, [specialties.length, selectedSpecialty, pagination?.total, isLoading]);

  const renderEmpty = useCallback(() => {
    if (!isLoading && doctors.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <Ionicons name="alert-circle-outline" size={48} color="#6b7280" />
          <ThemedText className="text-center mt-4" color="#6b7280">
            {selectedSpecialty === "Hamısı"
              ? "Heç bir həkim tapılmadı"
              : `${selectedSpecialty} ixtisası üzrə həkim tapılmadı`}
          </ThemedText>
        </View>
      );
    }
    return null;
  }, [isLoading, selectedSpecialty, doctors.length]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  }, [isLoading]);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => <DoctorCard doctor={item} />,
    []
  );

  const keyExtractor = useCallback((item: Doctor) => item.id, []);

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      );
    }

    return (
      <Animated.FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        bounces={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={100}
      />
    );
  };

  return (
    <ThemedView className="flex-1">
      {/* Animated Header */}
      <Animated.View
        style={{
          height: headerHeight,
          paddingHorizontal: headerPadding,
          paddingTop: insets.top,
          backgroundColor: "#3b82f6",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          zIndex: 1000,
        }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Animated.Text
              style={{
                fontSize: titleSize,
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              {`Xoş gəldiniz${user?.name ? `, ${user.name}` : ""} 👋`}
            </Animated.Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            opacity: searchOpacity,
            height: searchHeight,
            overflow: "hidden",
          }}
        >
          {/* Search Bar */}
          <TouchableOpacity
            className="bg-white/90 backdrop-blur-lg flex-row items-center px-4 py-3 rounded-2xl"
            onPress={() => setIsSearchModalVisible(true)}
          >
            <Ionicons name="search-outline" size={20} color="#6b7280" />
            <ThemedText className="ml-2" color="#6b7280">
              Həkim və ya ixtisas axtar
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Content */}
      {renderContent()}

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        sortBy={sortBy}
        availabilityFilter={availabilityFilter}
        onSortChange={(value) => {
          dispatch(setSortBy(value));
        }}
        onAvailabilityChange={(value) => {
          dispatch(setAvailabilityFilter(value));
        }}
      />

      {/* Search Modal */}
      <SearchModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
      />
    </ThemedView>
  );
};

export default Home;
