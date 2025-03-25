import {
  DoctorSettings,
  IDoctorSettings,
} from "../models/doctor.settings.model";
import mongoose from "mongoose";

export class DoctorSettingsService {
  static async getSettings(doctorId: string) {
    try {
      let settings = await DoctorSettings.findOne({ doctorId });

      // Eğer ayarlar yoksa varsayılan ayarları oluştur
      if (!settings) {
        // Varsayılan çalışma saatleri (Pazartesi-Cuma 09:00-17:00)
        const defaultWorkingHours = Array.from({ length: 7 }, (_, i) => ({
          dayOfWeek: i,
          startTime: "09:00",
          endTime: "17:00",
          isWorkingDay: i > 0 && i < 6, // Pazartesi-Cuma çalışma günleri
        }));

        settings = await DoctorSettings.create({
          doctorId: new mongoose.Types.ObjectId(doctorId),
          workingHours: defaultWorkingHours,
          appointmentDuration: 30, // Varsayılan randevu süresi 30 dakika
          blockedTimeSlots: [],
        });
      }

      return settings;
    } catch (error) {
      console.error("Doktor ayarları alınırken hata:", error);
      throw error;
    }
  }

  static async createOrUpdateSettings(
    doctorId: string,
    settings: Partial<IDoctorSettings>
  ) {
    const existingSettings = await DoctorSettings.findOne({ doctorId });

    if (existingSettings) {
      return DoctorSettings.findOneAndUpdate(
        { doctorId },
        { $set: settings },
        { new: true }
      );
    }

    // Varsayılan çalışma saatleri (Pazartesi-Cuma 09:00-17:00)
    const defaultWorkingHours = Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: i > 0 && i < 6, // Pazartesi-Cuma çalışma günleri
    }));

    return DoctorSettings.create({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      workingHours: settings.workingHours || defaultWorkingHours,
      appointmentDuration: settings.appointmentDuration || 30,
      blockedTimeSlots: settings.blockedTimeSlots || [],
    });
  }

  static async blockTimeSlot(doctorId: string, date: Date, time: string) {
    return DoctorSettings.findOneAndUpdate(
      { doctorId },
      {
        $push: {
          blockedTimeSlots: { date, time },
        },
      },
      { new: true }
    );
  }

  static async unblockTimeSlot(doctorId: string, date: Date, time: string) {
    return DoctorSettings.findOneAndUpdate(
      { doctorId },
      {
        $pull: {
          blockedTimeSlots: { date, time },
        },
      },
      { new: true }
    );
  }

  static async updateWorkingHours(
    doctorId: string,
    workingHours: IDoctorSettings["workingHours"]
  ) {
    return DoctorSettings.findOneAndUpdate(
      { doctorId },
      { $set: { workingHours } },
      { new: true }
    );
  }

  static async updateAppointmentDuration(doctorId: string, duration: number) {
    return DoctorSettings.findOneAndUpdate(
      { doctorId },
      { $set: { appointmentDuration: duration } },
      { new: true }
    );
  }
}
