import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailableDate {
  date: string;
  formattedDate: string;
  dayName: string;
  slots: TimeSlot[];
  appointmentDuration: number;
}

interface ReservationState {
  selectedDate: number | null;
  selectedTime: string | null;
  reason: string;
  showConfirmModal: boolean;
  availableDates: AvailableDate[];
  availableTimes: TimeSlot[];
}

const initialState: ReservationState = {
  selectedDate: null,
  selectedTime: null,
  reason: "",
  showConfirmModal: false,
  availableDates: [],
  availableTimes: [],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<number | null>) => {
      state.selectedDate = action.payload;
      // Reset time when date changes
      state.selectedTime = null;
    },
    setSelectedTime: (state, action: PayloadAction<string | null>) => {
      state.selectedTime = action.payload;
    },
    setReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload;
    },
    setShowConfirmModal: (state, action: PayloadAction<boolean>) => {
      state.showConfirmModal = action.payload;
    },
    setAvailableDates: (state, action: PayloadAction<AvailableDate[]>) => {
      state.availableDates = action.payload;
    },
    setAvailableTimes: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableTimes = action.payload;
    },
    resetReservation: () => initialState,
  },
});

export const {
  setSelectedDate,
  setSelectedTime,
  setReason,
  setShowConfirmModal,
  setAvailableDates,
  setAvailableTimes,
  resetReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
