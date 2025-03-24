import express from "express";
import * as commentsController from "../controllers/comments.controller";

import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

// Yorum oluştur
router.post(
  "/:appointmentId",
  auth,
  commentsController.createComment as express.RequestHandler
);

// Doktorun yorumlarını getir
router.get("/doctor/:doctorId", commentsController.getCommentsByDoctorId);

export default router;
