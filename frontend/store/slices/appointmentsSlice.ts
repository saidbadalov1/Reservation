import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appointment } from "@/services/appointments.services";

interface AppointmentsState {
  appointments: Appointment[];
}

const initialState: AppointmentsState = {
  appointments: [],
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
  },
});

export const { setAppointments, updateAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
