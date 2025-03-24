import { Router } from "express";
import * as doctorsController from "../controllers/doctors.controller";
import * as commentsController from "../controllers/comments.controller";

const router = Router();

router.get("/", doctorsController.getDoctors);
router.get("/search", doctorsController.searchDoctors);
router.get("/specialties", doctorsController.getSpecialties);
router.get("/:id", doctorsController.getDoctorById);
router.get("/:id/comments", commentsController.getCommentsByDoctorId);

export default router;
