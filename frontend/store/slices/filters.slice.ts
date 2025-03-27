import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DoctorSpecialty } from "@/types/doctor.types";

export interface Filters {
  specialty: DoctorSpecialty | null;
  searchQuery: string | null;
  limit: number;
  sort: "rating" | null;
}

interface FilterState {
  filters: Filters;
}

const initialState: FilterState = {
  filters: {
    specialty: null,
    searchQuery: null,
    limit: 10,
    sort: null,
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
