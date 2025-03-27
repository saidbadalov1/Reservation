import { Router } from "express";
import * as doctorsController from "../controllers/doctors.controller";

const router = Router();

router.get("/", doctorsController.getDoctors);
router.get("/search", doctorsController.searchDoctors);
router.get("/specialties", doctorsController.getSpecialties);
router.get("/:id", doctorsController.getDoctorById);

export default router;
