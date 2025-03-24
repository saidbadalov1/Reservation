import api from "./api";

export const userService = {
  updateProfileImage: async (formData: FormData) => {
    return api.put("/users/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateProfile: async (data: any) => {
    return api.put("/users/profile", data);
  },
  getProfile: async () => {
    return api.get("/users/profile");
  },
};
