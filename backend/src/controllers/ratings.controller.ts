import { Request, Response } from "express";
import * as ratingsService from "../services/ratings.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Get doctor ratings
export const getDoctorRatings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      res.status(400).json({ message: "Həkim ID-si tələb olunur" });
      return;
    }

    const ratings = await ratingsService.getDoctorRatings(doctorId);
    res.json(ratings);
  } catch (error) {
    console.error("getDoctorRatings error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Xəta baş verdi",
    });
  }
};

// Create rating
export const createRating = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { appointmentId, doctorId, rating, comment } = req.body;
    const patientId = req.user?.id;

    if (!patientId) {
      res.status(401).json({ message: "İstifadəçi təsdiqlənməyib" });
      return;
    }

    if (!appointmentId || !doctorId || !rating || !comment) {
      res.status(400).json({
        message: "Görüş ID-si, həkim ID-si, reytinq və rəy mətni tələb olunur",
      });
      return;
    }

    const newRating = await ratingsService.createRating(
      appointmentId,
      doctorId,
      patientId,
      rating,
      comment
    );

    res.status(201).json(newRating);
  } catch (error) {
    console.error("createRating error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Xəta baş verdi",
    });
  }
};
