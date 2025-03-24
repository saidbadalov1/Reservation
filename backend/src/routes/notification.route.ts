import express from "express";
import { auth } from "../middlewares/auth.middleware";
import NotificationController from "../controllers/notification.controller";

const router = express.Router();

// Kullanıcının bildirimlerini getir
router.get("/", auth, NotificationController.getMyNotifications);

// Bildirimi okundu olarak işaretle
router.patch("/:notificationId/read", auth, NotificationController.markAsRead);

// Tüm bildirimleri okundu olarak işaretle
router.patch("/read-all", auth, NotificationController.markAllAsRead);

// Yeni bildirim oluştur
router.post("/", auth, NotificationController.createNotification);

export default router;
