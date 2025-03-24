import { Schema, model, Document } from "mongoose";

export interface IRating extends Document {
  appointmentId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  patientId: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Bir randevuya sadece bir rating verilebilir
ratingSchema.index({ appointmentId: 1 }, { unique: true });

export const Rating = model<IRating>("Rating", ratingSchema);
