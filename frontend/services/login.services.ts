import api from "./api";

export interface LoginResponse {
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
}

export interface GetMeResponse {
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
