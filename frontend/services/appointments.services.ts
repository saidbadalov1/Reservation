import api from "./api";
import { TimeSlot } from "@/types/appointment.types";

export interface AppointmentDate {
  date: string;
  slots: TimeSlot[];
}

export interface GetAvailableDatesResponse {
  availableDates: AppointmentDate[];
}

export interface CreateAppointmentRequest {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface CreateAppointmentResponse {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reason?: string;
  createdAt: string;
}

export interface Appointment extends CreateAppointmentResponse {
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    image?: string;
  };
  patient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
  };
}

export interface GetAppointmentsResponse {
  appointments: Appointment[];
}

export const appointmentsApi = {
  getAvailableDates: async (doctorId: string) => {
    try {
      const response = await api.get(`/appointments/available/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error("Müsait tarihler alınırken hata:", error);
      throw error;
    }
  },

  createAppointment: async (
    data: CreateAppointmentRequest
  ): Promise<CreateAppointmentResponse> => {
    try {
      const response = await api.post("/appointments", data);

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getMyAppointments: async (): Promise<GetAppointmentsResponse> => {
    const response = await api.get("/appointments/my");
    return response.data;
  },

  getDoctorAppointments: async (): Promise<GetAppointmentsResponse> => {
    const response = await api.get("/appointments/doctor");
    return response.data;
  },

  confirmAppointment: async (appointmentId: string): Promise<void> => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: "confirmed",
    });
    return response.data;
  },

  rejectAppointment: async (appointmentId: string): Promise<void> => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: "rejected",
    });
    return response.data;
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: "cancel",
    });
    return response.data;
  },

  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);

    return response.data.data;
  },

  updateAppointmentStatus: async (
    appointmentId: string,
    action: "confirm" | "reject" | "complete" | "cancel"
  ) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: action,
    });
    return response.data;
  },
};
