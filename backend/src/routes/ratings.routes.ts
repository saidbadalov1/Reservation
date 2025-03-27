import { Router } from "express";
import * as ratingsController from "../controllers/ratings.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// Get doctor ratings (public)
router.get("/doctor/:doctorId", ratingsController.getDoctorRatings);

// Create rating (requires auth)
router.post("/", auth, ratingsController.createRating);

export default router;
