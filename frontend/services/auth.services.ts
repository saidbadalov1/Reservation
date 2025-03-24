import api from "./api";
import { DoctorSpecialty } from "@/types/doctor.types";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  specialty?: DoctorSpecialty;
  phone: string;
}

interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "patient" | "doctor";
      specialty?: DoctorSpecialty;
      phone: string;
    };
  };
}

export const register = async (
  params: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", params);
  return response.data;
};
