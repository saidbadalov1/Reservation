import { RegisterFormValues, RegisterResponse } from "@/types/auth.types";
import api from "./api";

export const register = async (
  params: RegisterFormValues
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", params);
  return response.data;
};
