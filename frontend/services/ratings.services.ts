import api from "./api";

interface CreateRatingDto {
  appointmentId: string;
  doctorId: string;
  rating: number;
  comment: string;
}

interface Rating {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}

interface DoctorRatings {
  averageRating: number;
  totalReviews: number;
  reviews: Rating[];
}

export const ratingsApi = {
  getDoctorRatings: async (doctorId: string): Promise<DoctorRatings> => {
    const response = await api.get(`/ratings/doctor/${doctorId}`);
    return response.data;
  },

  createRating: async (data: CreateRatingDto): Promise<Rating> => {
    const response = await api.post("/ratings", data);
    return response.data;
  },
};
