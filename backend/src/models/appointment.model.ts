import mongoose, { Document, Schema } from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface IAppointment extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

// İki randevunun çakışmasını engellemek için
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);
