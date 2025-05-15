import { User } from "@/types/user.types";
import api from "./api";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface GetMeResponse {
  user: User;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  getMe: async (token: string) => {
    const response = await api.get<GetMeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
