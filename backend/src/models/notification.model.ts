import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "appointment" | "system";
  appointmentId?: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, enum: ["appointment", "system"] },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
