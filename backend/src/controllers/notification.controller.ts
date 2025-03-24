import { Request, Response } from "express";
import { Notification } from "../models/notification.model";

// AuthRequest arabirimini middleware'den alıyoruz
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const NotificationController = {
  createNotification: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, message, type, appointmentId, userId } = req.body;

      const notification = await Notification.create({
        title,
        message,
        type,
        appointmentId,
        userId,
        isRead: false,
      });

      res.status(201).json({
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        appointmentId: notification.appointmentId,
        userId: notification.userId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (error) {
      console.error("Bildirim oluşturulurken hata:", error);
      res
        .status(500)
        .json({ message: "Bildirim oluşturulurken bir hata oluştu" });
    }
  },

  // Kullanıcının bildirimlerini getir
  getMyNotifications: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Oturum açmanız gerekiyor" });
        return;
      }

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      // _id'yi id olarak değiştir
      const formattedNotifications = notifications.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

      res.json({ notifications: formattedNotifications });
    } catch (error) {
      console.error("Bildirimler alınırken hata:", error);
      res
        .status(500)
        .json({ message: "Bildirimler alınırken bir hata oluştu" });
    }
  },

  // Bildirimi okundu olarak işaretle
  markAsRead: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Oturum açmanız gerekiyor" });
        return;
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      ).lean();

      if (!notification) {
        res.status(404).json({ message: "Bildirim bulunamadı" });
        return;
      }

      // _id'yi id olarak değiştir
      const { _id, ...rest } = notification;
      res.json({ id: _id, ...rest });
    } catch (error) {
      console.error("Bildirim güncellenirken hata:", error);
      res
        .status(500)
        .json({ message: "Bildirim güncellenirken bir hata oluştu" });
    }
  },

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Oturum açmanız gerekiyor" });
        return;
      }

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      res.json({ message: "Tüm bildirimler okundu olarak işaretlendi" });
    } catch (error) {
      console.error("Bildirimler güncellenirken hata:", error);
      res
        .status(500)
        .json({ message: "Bildirimler güncellenirken bir hata oluştu" });
    }
  },
};

export default NotificationController;
