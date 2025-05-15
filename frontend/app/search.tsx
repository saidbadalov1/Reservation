import { SafeAreaView } from "@/components/NativeComponents/SafeAreaView";
import SearchDoctorCard from "@/components/Search/SearchDoctorCard";
import SearchHeader from "@/components/Search/SearchHeader";
import { Header } from "@/components/ui/Header";
import { Doctor } from "@/types/doctor.types";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { fetchDoctors, setCurrentPage } from "@/store/slices/doctorsSlice";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "@/store/hooks";
import { staticDoctors } from "@/utils/staticDoctors";
import { FlashList } from "@shopify/flash-list";

export const DOCTORS_PER_PAGE = 10;

const SearchScreen = () => {
  const dispatch = useDispatch();

  const { doctors, isLoading, pagination, currentPage } = useSelector(
    (state) => state.doctors
  );

  const { filters } = useSelector((state) => state.filters);

  // Filter static doctors based on applied filters
  const filteredStaticDoctors = useMemo(() => {
    // If no filters are applied, return all static doctors
    if (!filters.specialty && !filters.searchQuery) {
      return staticDoctors;
    }

    return staticDoctors.filter((doctor) => {
      const matchesSpecialty =
        !filters.specialty || doctor.specialty === filters.specialty;
      const matchesName =
        !filters.searchQuery ||
        doctor.name.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesSpecialty && matchesName;
    });
  }, [filters]);

  // Combined doctors list with filtered static doctors
  const combinedDoctors = useMemo(() => {
    // Get IDs of all doctors from API to avoid duplicates
    const apiDoctorIds = new Set(doctors.map((d) => d.id));

    // Filter out static doctors that might also come from API
    const uniqueStaticDoctors = filteredStaticDoctors.filter(
      (d) => !apiDoctorIds.has(d.id)
    );

    return [...uniqueStaticDoctors, ...doctors];
  }, [doctors, filteredStaticDoctors]);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination?.hasMore) {
      const nextPage = currentPage + 1;
      dispatch(setCurrentPage(nextPage));
      dispatch(
        fetchDoctors({
          filters,
          page: nextPage,
        })
      );
    }
  }, [dispatch, currentPage, isLoading, pagination, filters]);

  const renderHeader = useCallback(() => {
    return <SearchHeader />;
  }, []);

  const renderEmpty = useCallback(() => {
    if (!isLoading && combinedDoctors.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <Ionicons name="alert-circle-outline" size={48} color="#6b7280" />
          <ThemedText weight="bold" className="text-center mt-4 text-gray-500">
            Həkim tapılmadı
          </ThemedText>
        </View>
      );
    }
    return null;
  }, [isLoading, combinedDoctors.length]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  }, [isLoading]);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => <SearchDoctorCard doctor={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: Doctor, index: number) => item.id || index.toString(),
    []
  );

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <Header title="Həkim axtar" showBackButton />
        <View className="flex-1">
          <FlashList
            data={staticDoctors}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            estimatedItemSize={90}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SearchScreen;
