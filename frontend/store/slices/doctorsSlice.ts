import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doctorsApi, Pagination } from "@/services/doctors.services";
import { Doctor } from "@/types/doctor.types";

interface DoctorsState {
  doctors: Doctor[];
  specialties: string[];
  selectedSpecialty: string;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  sortBy: "rating" | null;
}

const initialState: DoctorsState = {
  doctors: [],
  specialties: [],
  selectedSpecialty: "Hamısı",
  isLoading: false,
  error: null,
  pagination: null,
  sortBy: null,
};

interface FetchDoctorsParams {
  specialty?: string;
  page?: number;
  limit?: number;
  sort?: "rating";
  available?: boolean;
}

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async ({
    specialty,
    page = 1,
    limit = 10,
    sort,
  }: FetchDoctorsParams) => {
    const response = await doctorsApi.getDoctors({
      specialty,
      page,
      limit,
      sort,
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
    setSelectedSpecialty: (state, action: PayloadAction<string>) => {
      if (state.selectedSpecialty !== action.payload) {
        state.selectedSpecialty = action.payload;
        state.doctors = [];
        state.pagination = null;
      }
    },
    setSortBy: (state, action: PayloadAction<"rating" | null>) => {
      if (state.sortBy !== action.payload) {
        state.sortBy = action.payload;
        state.doctors = [];
        state.pagination = null;
      }
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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

export const {
  setSelectedSpecialty,
  setSortBy,

  setIsLoading,
} = doctorsSlice.actions;
export default doctorsSlice.reducer;