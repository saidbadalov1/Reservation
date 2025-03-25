import express, { RequestHandler } from "express";
import { DoctorSettingsController } from "../controllers/doctor.settings.controller";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = express.Router();

// Tüm rotalar için doktor rolü kontrolü
router.use(auth as RequestHandler, checkRole(["doctor"]) as RequestHandler);

// Doktor ayarlarını getir
router.get("/", DoctorSettingsController.getSettings as RequestHandler);

// Doktor ayarlarını güncelle
router.put("/", DoctorSettingsController.updateSettings as RequestHandler);

// Saat dilimi blokla
router.post(
  "/block-time",
  DoctorSettingsController.blockTimeSlot as RequestHandler
);

// Saat dilimi blokajını kaldır
router.post(
  "/unblock-time",
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
