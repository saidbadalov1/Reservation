import api from "./api";
import { RegisterRequest } from "./auth.services";

export interface RegisterResponse {
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "patient" | "doctor";
      image: string;
      phone: string;
      rating?: number;
      reviews?: number;
      speciality?: string;
    };
  };
}

export const registerApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },
};
