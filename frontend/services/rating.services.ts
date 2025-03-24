import api from "./api";

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  patientId: {
    id: string;
    name: string;
    image?: string;
  };
  appointmentId: {
    id: string;
    date: string;
    time: string;
  };
}

export const ratingApi = {
  // Rating ver
  createRating: async (
    appointmentId: string,
    rating: number,
    comment?: string
  ) => {
    const response = await api.post(
      `/ratings/appointments/${appointmentId}/rate`,
      {
        rating,
        comment,
      }
    );
    return response.data;
  },

  // Doktorun ratinglerini getir
  getDoctorRatings: async (doctorId: string) => {
    const response = await api.get(`/ratings/doctors/${doctorId}/ratings`);
    return response.data.ratings as Rating[];
  },
};
