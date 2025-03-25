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

export interface GetDoctorsParams {
  specialty?: string;
  page?: number;
  limit?: number;
  sort?: "rating";

}

export const doctorsApi = {
  getDoctors: async ({
    specialty,
    page = 1,
    limit = 10,
    sort,

  }: GetDoctorsParams = {}) => {
    const response = await api.get<GetDoctorsResponse>("/doctors", {
      params: { specialty, page, limit, sort },
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

export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  const response = await api.get(`/doctors/search?query=${query}`);
  return response.data.data;
};

export const getDoctors = async (): Promise<GetDoctorsResponse> => {
  const response = await api.get("/doctors");
  return response.data;
};

export const getDoctorById = async (id: string): Promise<GetDoctorResponse> => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getDoctorComments = async (doctorId: string) => {
  const response = await api.get(`/doctors/${doctorId}/comments`);
  return response.data;
};
