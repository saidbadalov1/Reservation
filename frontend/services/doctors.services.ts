import { Filters } from "@/store/slices/filters.slice";
import api from "./api";
import { Doctor } from "@/types/doctor.types";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GetDoctorsResponse {
  doctors: Doctor[];
  pagination: Pagination;
}

export interface GetDoctorResponse {
  data: Doctor;
}

export interface GetSpecialtiesResponse {
  specialties: string[];
}

export const doctorsApi = {
  getDoctors: async (filters: Filters) => {
    const response = await api.get<GetDoctorsResponse>("/doctors", {
      params: filters,
    });
    return response.data;
  },
  getSpecialties: async () => {
    const response = await api.get<GetSpecialtiesResponse>(
      "/doctors/specialties"
    );
    return response.data;
  },
};

export const getDoctorById = async (id: string): Promise<GetDoctorResponse> => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getDoctorComments = async (doctorId: string) => {
  const response = await api.get(`/doctors/${doctorId}/comments`);
  return response.data;
};
