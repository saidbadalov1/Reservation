import { Request, Response } from "express";
import { DoctorSettingsService } from "../services/doctor.settings.service";
import { AuthRequest } from "../types/auth";

export class DoctorSettingsController {
  static async getSettings(req: AuthRequest, res: Response) {
    try {

      const settings = await DoctorSettingsService.getSettings(req.user!.id);

      res.json(settings);
    } catch (error) {

      res.status(500).json({ message: "Ayarlar alınırken bir hata oluştu" });
    }
  }

  static async updateSettings(req: AuthRequest, res: Response) {
    try {
      const { workingHours, appointmentDuration, blockedTimeSlots } = req.body;
      const settings = await DoctorSettingsService.createOrUpdateSettings(
        req.user!.id,
        {
          workingHours,
          appointmentDuration,
          blockedTimeSlots,
        }
      );
      res.json(settings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ayarlar güncellenirken bir hata oluştu" });
    }
  }

  static async blockTimeSlot(req: AuthRequest, res: Response) {
    try {
      const { date, time } = req.body;
      const settings = await DoctorSettingsService.blockTimeSlot(
        req.user!.id,
        new Date(date),
        time
      );
      res.json(settings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Saat dilimi bloklanırken bir hata oluştu" });
    }
  }

  static async unblockTimeSlot(req: AuthRequest, res: Response) {
    try {
      const { date, time } = req.body;
      const settings = await DoctorSettingsService.unblockTimeSlot(
        req.user!.id,
        new Date(date),
        time
      );
      res.json(settings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Saat dilimi blokajı kaldırılırken bir hata oluştu" });
    }
  }

  static async updateWorkingHours(req: AuthRequest, res: Response) {
    try {
      const { workingHours } = req.body;

      if (!Array.isArray(workingHours)) {
        return res
          .status(400)
          .json({ message: "Geçersiz çalışma saatleri formatı" });
      }

      const settings = await DoctorSettingsService.updateWorkingHours(
        req.user!.id,
        workingHours
      );
      res.json(settings);
    } catch (error) {
      console.error("Çalışma saatleri güncellenirken hata:", error);
      res
        .status(500)
        .json({ message: "Çalışma saatleri güncellenirken bir hata oluştu" });
    }
  }

  static async updateAppointmentDuration(req: AuthRequest, res: Response) {
    try {
      const { duration } = req.body;

      if (!duration || typeof duration !== "number" || duration <= 0) {
        return res.status(400).json({ message: "Geçersiz randevu süresi" });
      }

      const settings = await DoctorSettingsService.updateAppointmentDuration(
        req.user!.id,
        duration
      );
      res.json(settings);
    } catch (error) {
      console.error("Randevu süresi güncellenirken hata:", error);
      res
        .status(500)
        .json({ message: "Randevu süresi güncellenirken bir hata oluştu" });
    }
  }

  static async getSettingsById(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const settings = await DoctorSettingsService.getSettings(doctorId);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
