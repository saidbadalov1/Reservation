import { SafeAreaView } from "@/components/NativeComponents/SafeAreaView";
import SearchDoctorCard from "@/components/Search/SearchDoctorCard";
import SearchHeader from "@/components/Search/SearchHeader";
import { Header } from "@/components/ui/Header";
import { Doctor } from "@/types/doctor.types";
import React, { useCallback } from "react";
import { ActivityIndicator, View, FlatList } from "react-native";
import { fetchDoctors, setCurrentPage } from "@/store/slices/doctorsSlice";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "@/store/hooks";

export const DOCTORS_PER_PAGE = 10;

const SearchScreen = () => {
  const dispatch = useDispatch();

  const { doctors, isLoading, pagination, currentPage } = useSelector(
    (state) => state.doctors
  );

  const { filters } = useSelector((state) => state.filters);

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
    if (!isLoading && doctors.length === 0) {
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
  }, [isLoading, doctors.length]);

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

  const keyExtractor = useCallback((item: Doctor) => item.id, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <Header title="Həkim axtar" showBackButton />
        <View className="flex-1">
          <FlatList
            data={doctors}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader()}
            onEndReached={loadMore}
            onEndReachedThreshold={0}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SearchScreen;
