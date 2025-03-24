import api from "./api";

export interface Comment {
  _id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  comment: string;
  createdAt: string;
  patient?: {
    name: string;
    image?: string;
  };
}

export const commentsApi = {
  createComment: async (
    appointmentId: string,
    comment: string
  ): Promise<Comment> => {
    const response = await api.post(`/comments/${appointmentId}`, { comment });
    return response.data;
  },

  getDoctorComments: async (doctorId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/doctor/${doctorId}`);
    return response.data;
  },
};
