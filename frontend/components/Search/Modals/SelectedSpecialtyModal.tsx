import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { closeModal, ModalType } from "@/store/slices/modal.slice";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { getSpecialtyIcon } from "@/utils/specialtyIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { setFilters } from "@/store/slices/filters.slice";
import { DoctorSpecialty } from "@/types/doctor.types";

const SpecialtyItem = ({
  name,
  isSelected,
  onPress,
}: {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center p-3 rounded-lg mb-2 ${
      isSelected ? "bg-primary-50" : "bg-white"
    }`}
  >
    <View
      className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
        isSelected ? "bg-primary-100" : "bg-gray-100"
      }`}
    >
      {getSpecialtyIcon(name, 22, isSelected ? "#254EDB" : "#6b7280")}
    </View>
    <ThemedText
      weight={isSelected ? "bold" : "medium"}
      className={`text-sm ${
        isSelected ? "text-primary-600" : "text-typography-900"
      }`}
    >
      {name}
    </ThemedText>
    {isSelected && (
      <View className="ml-auto">
        <Ionicons name="checkmark-circle" size={20} color="#254EDB" />
      </View>
    )}
  </TouchableOpacity>
);

const SelectedSpecialtyModal: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.specialties);
  const { filters } = useSelector((state: RootState) => state.filters);
  const { specialtyModal } = useSelector((state: RootState) => state.modal);

  const translateY = useSharedValue(300);

  React.useEffect(() => {
    if (specialtyModal) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
    } else {
      translateY.value = withTiming(300, {
        duration: 300,
        easing: Easing.in(Easing.exp),
      });
    }
  }, [specialtyModal]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleSelectSpecialty = (specialty: string) => {
    dispatch(setFilters({ specialty: specialty as DoctorSpecialty }));
    dispatch(closeModal(ModalType.SPECIALTY));
  };

  const handleClearSelection = () => {
    dispatch(setFilters({ specialty: null }));
    dispatch(closeModal(ModalType.SPECIALTY));
  };

  const handleCloseModal = () => {
    dispatch(closeModal(ModalType.SPECIALTY));
  };

  return (
    <Modal
      visible={specialtyModal}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <Animated.View
              style={[animatedStyle]}
              className="bg-white rounded-t-3xl max-h-[70%] overflow-hidden"
            >
              {/* Header */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                <TouchableOpacity
                  onPress={handleClearSelection}
                  className="py-1 px-3"
                >
                  <ThemedText className="text-sm text-primary-600">
                    Təmizlə
                  </ThemedText>
                </TouchableOpacity>
                <ThemedText
                  weight="bold"
                  className="text-base text-typography-900"
                >
                  İxtisas seçin
                </ThemedText>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  className="py-1 px-3"
                >
                  <Ionicons name="close" size={24} color="#18181B" />
                </TouchableOpacity>
              </View>

              {/* Specialties List */}
              <ScrollView className="p-4">
                {items.map((specialty) => (
                  <SpecialtyItem
                    key={specialty}
                    name={specialty}
                    isSelected={specialty === filters.specialty}
                    onPress={() => handleSelectSpecialty(specialty)}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectedSpecialtyModal;
