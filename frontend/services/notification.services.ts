import axios from "axios";

import { storage } from "./storage.services";
import api from "./api";

export const notificationService = {
  // Bildirimleri getir
  getNotifications: async () => {
    const response = await api.get(`/notifications`);
    return response.data.data;
  },

  // Okunmamış bildirimleri say
  getUnreadCount: async () => {
    try {
      const notifications = await notificationService.getNotifications();

      if (!notifications || !Array.isArray(notifications)) {
        return 0;
      }

      // Okunmamış bildirimleri filtrele ve say
      return notifications.filter((notification) => !notification.isRead)
        .length;
    } catch (error) {
      console.error("Okunmamış bildirimler sayılırken hata:", error);
      return 0;
    }
  },

  // Bildirimi okundu olarak işaretle
  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data.success;
  },

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead: async () => {
    const response = await api.patch(`/notifications/read-all`);
    return response.data.success;
  },
};
