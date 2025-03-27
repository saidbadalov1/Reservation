import { Router } from "express";
import { DoctorSettingsController } from "../controllers/doctor.settings.controller";
import { RequestHandler } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = Router();

// Public route - anyone can get doctor settings
router.get(
  "/:doctorId",
  DoctorSettingsController.getSettingsById as RequestHandler
);

// Protected routes - only doctor can modify their own settings
router.use(auth as RequestHandler);
router.use(checkRole(["doctor"]) as RequestHandler);

// Doktor ayarlarını getir
router.get("/", DoctorSettingsController.getSettings as RequestHandler);

// Doktor ayarlarını güncelle
router.put("/", DoctorSettingsController.updateSettings as RequestHandler);

// Saat dilimi blokla
router.post(
  "/block-time-slot",
  DoctorSettingsController.blockTimeSlot as RequestHandler
);

// Saat dilimi blokajını kaldır
router.post(
  "/unblock-time-slot",
  DoctorSettingsController.unblockTimeSlot as RequestHandler
);

// Çalışma saatlerini güncelle
router.put(
  "/working-hours",
  DoctorSettingsController.updateWorkingHours as RequestHandler
);

// Randevu süresini güncelle
router.put(
  "/appointment-duration",
  DoctorSettingsController.updateAppointmentDuration as RequestHandler
);

export default router;
