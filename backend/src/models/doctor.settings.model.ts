import mongoose from "mongoose";

export interface IDoctorSettings {
  doctorId: mongoose.Types.ObjectId;
  workingHours: {
    dayOfWeek: number; // 0-6 (Pazar-Cumartesi)
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    isWorkingDay: boolean;
  }[];
  appointmentDuration: number; // Dakika cinsinden
  blockedTimeSlots: {
    date: Date;
    time: string;
  }[];
}

const doctorSettingsSchema = new mongoose.Schema<IDoctorSettings>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workingHours: [
      {
        dayOfWeek: { type: Number, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isWorkingDay: { type: Boolean, default: true },
      },
    ],
    appointmentDuration: {
      type: Number,
      required: true,
      default: 30, // Varsayılan randevu süresi 30 dakika
    },
    blockedTimeSlots: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Aynı doktor için tekrar ayar oluşturulmasını engelle
doctorSettingsSchema.index({ doctorId: 1 }, { unique: true });

export const DoctorSettings = mongoose.model<IDoctorSettings>(
  "DoctorSettings",
  doctorSettingsSchema
);
