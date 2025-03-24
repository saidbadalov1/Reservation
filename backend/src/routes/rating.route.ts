import express from "express";
import { auth } from "../middlewares/auth.middleware";
import RatingController from "../controllers/rating.controller";

const router = express.Router();

// Rating ver
router.post(
  "/appointments/:appointmentId/rate",
  auth,
  RatingController.createRating
);

// Doktorun ratinglerini getir
router.get("/doctors/:doctorId/ratings", RatingController.getDoctorRatings);

export default router;
