import React, { useEffect, useCallback } from "react";
import { View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { fetchDoctors, setCurrentPage } from "@/store/slices/doctorsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import SelectedSpecialtyModal from "./Modals/SelectedSpecialtyModal";
import SortModal from "./Modals/SortModal";
import { ThemedText } from "@/components/ThemedText";
import { openModal, ModalType } from "@/store/slices/modal.slice";
import { globalStyles } from "@/utils/globalStyles";
import { setFilters } from "@/store/slices/filters.slice";

const FilterButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-center gap-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }}
  >
    <ThemedText weight="medium" className="text-xs text-typography-900">
      {label}
    </ThemedText>
    <Ionicons name="chevron-down" size={16} color="#18181B" />
  </TouchableOpacity>
);

const SearchHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { filters } = useSelector((state: RootState) => state.filters);

  const handleGetDoctors = async () => {
    dispatch(
      fetchDoctors({
        filters,
        page: 1,
      })
    );
  };

  const performSearch = async (text: string) => {
    dispatch(setCurrentPage(1));
    dispatch(setFilters({ searchQuery: text }));
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      performSearch(text);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    handleGetDoctors();
  }, [filters]);

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(openModal(modalType));
  };

  const getSortLabel = () => {
    if (filters.sort === "rating") return "Ən yüksək reytinq";
    return "Sıralama";
  };

  return (
    <View className="py-4 gap-y-4">
      {/* Search Section */}
      <View
        style={globalStyles.container}
        className="flex-row items-center gap-x-2"
      >
        {/* Search Input */}
        <View className="flex-1 flex-row items-center bg-white border border-gray-300 rounded-xl p-3 gap-x-3">
          <Ionicons name="search-outline" size={20} color="#6C737F" />
          <TextInput
            defaultValue={filters.searchQuery ?? ""}
            onChangeText={debouncedSearch}
            placeholder="Həkim adı, ixtisas..."
            placeholderTextColor="#71717A"
            className="flex-1 text-black"
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          className="bg-gray-50 rounded-lg items-center justify-center p-3 shadow-sm"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Ionicons name="options-outline" size={20} color="#254EDB" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 16,
        }}
      >
        <FilterButton
          label={filters.specialty || "İxtisas"}
          onPress={() => handleOpenModal(ModalType.SPECIALTY)}
        />
        <FilterButton
          label={getSortLabel()}
          onPress={() => handleOpenModal(ModalType.SORT)}
        />
      </ScrollView>

      {/* Modals */}
      <SelectedSpecialtyModal />
      <SortModal />
    </View>
  );
};

export default SearchHeader;
