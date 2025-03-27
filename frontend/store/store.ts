import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorsReducer from "./slices/doctorsSlice";
import appointmentsReducer from "./slices/appointmentsSlice";
import reservationReducer from "./slices/reservationSlice";
import doctorReducer from "./slices/doctorSlice";
import specialtiesReducer from "./slices/specialties.slice";
import modalReducer from "./slices/modal.slice";
import filtersReducer from "./slices/filters.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
    reservation: reservationReducer,
    doctor: doctorReducer,
    specialties: specialtiesReducer,
    modal: modalReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
