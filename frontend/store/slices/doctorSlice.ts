import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Doctor } from "@/types/doctor.types";
import api from "@/services/api";

interface DoctorState {
  currentDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  currentDoctor: null,
  loading: false,
  error: null,
};

export const fetchDoctor = createAsyncThunk(
  "doctor/fetchDoctor",
  async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data.data;
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    resetDoctor: (state) => {
      state.currentDoctor = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDoctor.fulfilled,
        (state, action: PayloadAction<Doctor>) => {
          state.currentDoctor = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Xəta baş verdi";
      });
  },
});

export const { resetDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
