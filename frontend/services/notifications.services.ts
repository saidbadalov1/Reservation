import api from "./api";
import { Notification } from "@/types/notification.types";

export const notificationsApi = {
  getMyNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response;
    } catch (error) {
      console.error("Bildirimler alınırken hata:", error);
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error("Bildirim işaretlenirken hata:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/read-all");
      return response;
    } catch (error) {
      console.error("Bildirimler işaretlenirken hata:", error);
      throw error;
    }
  },

  createAppointmentNotification: async (appointment: any) => {
    try {
      const title =
        appointment.status === "pending"
          ? "Yeni Görüş Sorğusu"
          : appointment.status === "confirmed"
          ? "Görüş Təsdiqləndi"
          : appointment.status === "rejected"
          ? "Görüş Rədd Edildi"
          : "Görüş Tamamlandı";

      const message =
        appointment.status === "pending"
          ? `${appointment.doctor.name} tərəfindən yeni görüş sorğusu`
          : appointment.status === "confirmed"
          ? `${appointment.doctor.name} tərəfindən görüş təsdiqləndi`
          : appointment.status === "rejected"
          ? `${appointment.doctor.name} tərəfindən görüş rədd edildi`
          : `${appointment.doctor.name} tərəfindən görüş tamamlandı`;

      const notification = await api.post("/notifications", {
        title,
        message,
        type: "appointment",
        appointmentId: appointment._id,
        userId: appointment.patientId,
      });

      return notification.data;
    } catch (error) {
      console.error("Bildirim oluşturulurken hata:", error);
      throw error;
    }
  },
};
