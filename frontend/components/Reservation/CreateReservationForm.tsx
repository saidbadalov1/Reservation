import React, { useEffect } from "react";
import { View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { ThemedText } from "../ThemedText";
import { globalStyles } from "@/utils/globalStyles";
import {
  setSelectedDate,
  setSelectedTime,
  setReason,
  setAvailableTimes,
} from "@/store/slices/reservationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface DateItemProps {
  day: string;
  date: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  index: number;
}

interface TimeItemProps {
  time: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  index: number;
}

const TimeItem: React.FC<TimeItemProps> = ({
  time,
  isSelected,
  isDisabled,
  onSelect,
  index,
}) => {
  const backgroundColor = isSelected
    ? "bg-primary-500"
    : isDisabled
    ? "bg-gray-100"
    : "bg-white";

  const textColor = isSelected
    ? "text-white"
    : isDisabled
    ? "text-typography-400"
    : "text-typography-900";

  const borderColor =
    !isSelected && !isDisabled ? "border border-gray-200" : "";

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={isDisabled}
      className={`w-[64px] py-2 rounded-xl items-center justify-center ${backgroundColor} ${borderColor}`}
      style={{
        marginRight: 12,
        marginLeft: index === 0 ? 16 : 0,
      }}
    >
      <ThemedText className={`text-sm ${textColor}`} weight="medium">
        {time}
      </ThemedText>
    </TouchableOpacity>
  );
};

const DateItem: React.FC<DateItemProps> = ({
  day,
  date,
  isSelected,
  isDisabled,
  onSelect,
  index,
}) => {
  const backgroundColor = isSelected
    ? "bg-primary-500"
    : isDisabled
    ? "bg-gray-100"
    : "bg-white";

  const textColor = isSelected
    ? "text-white"
    : isDisabled
    ? "text-typography-400"
    : "text-typography-900";

  const borderColor =
    !isSelected && !isDisabled ? "border border-gray-200" : "";

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={isDisabled}
      className={`w-[72px] py-3 px-1 rounded-xl items-center justify-center ${backgroundColor} ${borderColor}`}
      style={{
        marginRight: 16,
        marginLeft: index === 0 ? 16 : 0,
      }}
    >
      <ThemedText className={`text-xs ${textColor} mb-1`} weight="medium">
        {day}
      </ThemedText>
      <ThemedText className={`text-xl ${textColor}`} weight="bold">
        {date}
      </ThemedText>
    </TouchableOpacity>
  );
};

const CreateReservationForm = () => {
  const dispatch = useDispatch();
  const { selectedDate, selectedTime, reason, availableDates, availableTimes } =
    useSelector((state: RootState) => state.reservation);

  const currentDate = new Date();
  const month = currentDate.toLocaleString("az-AZ", { month: "long" });
  const year = currentDate.getFullYear();

  // When date is selected, update available times
  useEffect(() => {
    if (selectedDate) {
      const dateInfo = availableDates.find(
        (d) => new Date(d.date).getDate() === selectedDate
      );
      if (dateInfo) {
        dispatch(setAvailableTimes(dateInfo.slots));
      }
    }
  }, [selectedDate, availableDates]);

  const getFormattedDateTime = () => {
    if (selectedDate && selectedTime) {
      return `${selectedDate} ${month} ${year}`;
    }
    return "";
  };

  return (
    <View className="py-8">
      <View style={globalStyles.container}>
        <ThemedText weight="bold" className="text-xl text-typography-900 mb-3">
          {getFormattedDateTime() || "Tarix və saat seçin"}
        </ThemedText>
      </View>

      {/* Date Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {availableDates.map((dateInfo, index) => {
          const date = new Date(dateInfo.date);
          const dayNumber = date.getDate();
          const isAvailable = dateInfo.slots.some((slot) => slot.available);

          return (
            <DateItem
              key={dateInfo.date}
              index={index}
              day={dateInfo.dayName}
              date={dayNumber}
              isSelected={selectedDate === dayNumber}
              isDisabled={!isAvailable}
              onSelect={() => {
                dispatch(setSelectedTime(null));
                dispatch(setSelectedDate(dayNumber));
              }}
            />
          );
        })}
      </ScrollView>

      {/* Time Selection */}
      {selectedDate && (
        <>
          <View style={globalStyles.container} className="mt-6">
            <ThemedText
              weight="bold"
              className="text-xl text-typography-900 mb-3"
            >
              Saat seçin
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-6"
          >
            {availableTimes.map((slot, index) => (
              <TimeItem
                key={slot.time}
                index={index}
                time={slot.time}
                isSelected={selectedTime === slot.time}
                isDisabled={!slot.available}
                onSelect={() => dispatch(setSelectedTime(slot.time))}
              />
            ))}
          </ScrollView>
        </>
      )}

      {/* Reason Input */}
      {selectedDate && selectedTime && (
        <View style={globalStyles.container}>
          <ThemedText
            weight="bold"
            className="text-xl text-typography-900 mb-3"
          >
            Görüş səbəbi
          </ThemedText>
          <TextInput
            value={reason}
            onChangeText={(text) => dispatch(setReason(text))}
            placeholder="Görüş səbəbini qeyd edin..."
            multiline
            numberOfLines={4}
            className="bg-gray-100 p-4 rounded-xl text-typography-900"
            placeholderTextColor="#9ca3af"
            style={{ textAlignVertical: "top" }}
          />
        </View>
      )}
    </View>
  );
};

export default CreateReservationForm;
