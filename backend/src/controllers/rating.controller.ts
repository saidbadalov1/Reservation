import { Request, Response } from "express";
import { Rating } from "../models/rating.model";
import { Appointment } from "../models/appointment.model";
import { User } from "../models/user.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const RatingController = {
  // Rating ver
  createRating: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { appointmentId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Oturum açmanız gerekiyor" });
        return;
      }

      // Randevuyu kontrol et
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        res.status(404).json({ message: "Randevu bulunamadı" });
        return;
      }

      // Randevunun tamamlanmış olduğunu kontrol et
      if (appointment.status !== "completed") {
        res
          .status(400)
          .json({
            message: "Sadece tamamlanmış randevulara rating verilebilir",
          });
        return;
      }

      // Kullanıcının hasta olduğunu kontrol et
      if (appointment.patientId.toString() !== userId) {
        res.status(403).json({ message: "Sadece hasta rating verebilir" });
        return;
      }

      // Rating'i oluştur
      const newRating = await Rating.create({
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: userId,
        rating,
        comment,
      });

      // Doktorun ortalama rating'ini güncelle
      const doctorRatings = await Rating.find({
        doctorId: appointment.doctorId,
      });
      const averageRating =
        doctorRatings.reduce((acc, curr) => acc + curr.rating, 0) /
        doctorRatings.length;

      await User.findByIdAndUpdate(appointment.doctorId, {
        rating: averageRating,
      });

      res.status(201).json({
        id: newRating._id,
        rating: newRating.rating,
        comment: newRating.comment,
        createdAt: newRating.createdAt,
      });
    } catch (error: any) {
      console.error("Rating oluşturulurken hata:", error);
      if (error.code === 11000) {
        res.status(400).json({ message: "Bu randevuya zaten rating verilmiş" });
        return;
      }
      res
        .status(500)
        .json({ message: "Rating oluşturulurken bir hata oluştu" });
    }
  },

  // Doktorun ratinglerini getir
  getDoctorRatings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { doctorId } = req.params;

      const ratings = await Rating.find({ doctorId })
        .populate("patientId", "name image")
        .populate("appointmentId", "date time")
        .sort({ createdAt: -1 })
        .lean();

      // _id'yi id olarak değiştir
      const formattedRatings = ratings.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

      res.json({ ratings: formattedRatings });
    } catch (error) {
      console.error("Ratingler alınırken hata:", error);
      res.status(500).json({ message: "Ratingler alınırken bir hata oluştu" });
    }
  },
};

export default RatingController;
