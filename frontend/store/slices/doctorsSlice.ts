import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  doctorsApi,
  GetDoctorsResponse,
  Pagination,
} from "@/services/doctors.services";
import { Doctor } from "@/types/doctor.types";
import { Filters } from "./filters.slice";

interface DoctorsState {
  doctors: Doctor[];
  specialties: string[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentPage: number;
}

export interface DoctorsFilters extends Filters {
  page: number;
}

const initialState: DoctorsState = {
  doctors: [],
  specialties: [],
  isLoading: false,
  error: null,
  pagination: null,
  currentPage: 1,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async ({
    specialty,
    limit = 10,
    sort,
    searchQuery,
    page,
  }: DoctorsFilters) => {
    const response = await doctorsApi.getDoctors({
      specialty,
      limit,
      sort,
      searchQuery,
    });

    return {
      doctors: response.doctors,
      pagination: response.pagination,
      page,
    };
  }
);

export const fetchSpecialties = createAsyncThunk(
  "doctors/fetchSpecialties",
  async () => {
    const response = await doctorsApi.getSpecialties();
    return response.specialties;
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<GetDoctorsResponse>) => {
      state.doctors = action.payload.doctors;
      state.pagination = action.payload.pagination;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        // İlk sayfa ise listeyi sıfırla, değilse ekle
        if (action.payload.page === 1) {
          state.doctors = action.payload.doctors;
        } else {
          // Yeni doktorları eklerken tekrar eden ID'leri önle
          const existingIds = new Set(state.doctors.map((d) => d.id));
          const newDoctors = action.payload.doctors.filter(
            (d) => !existingIds.has(d.id)
          );
          state.doctors = [...state.doctors, ...newDoctors];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Həkimləri yükləmək mümkün olmadı";
      })
      // Fetch Specialties
      .addCase(fetchSpecialties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specialties = action.payload;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "İxtisasları yükləmək mümkün olmadı";
      });
  },
});

export const { setIsLoading, setDoctors, setCurrentPage } =
  doctorsSlice.actions;
export default doctorsSlice.reducer;
