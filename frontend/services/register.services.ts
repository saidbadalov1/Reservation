import { RegisterFormValues, RegisterResponse } from "@/types/auth.types";
import api from "./api";

export const registerApi = {
  register: async (data: RegisterFormValues) => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },
};
