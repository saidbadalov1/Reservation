import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doctorsApi } from "@/services/doctors.services";

interface SpecialtiesState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SpecialtiesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSpecialties = createAsyncThunk(
  "specialties/fetchSpecialties",
  async () => {
    const response = await doctorsApi.getSpecialties();
    return response;
  }
);

const specialtiesSlice = createSlice({
  name: "specialties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.specialties;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Xəta baş verdi";
      });
  },
});

export const {} = specialtiesSlice.actions;
export default specialtiesSlice.reducer;
