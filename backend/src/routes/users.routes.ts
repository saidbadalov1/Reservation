import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Profil bilgilerini getir
router.get("/profile", auth, usersController.getProfile);

// Profil bilgilerini güncelle
router.put("/profile", auth, usersController.updateProfile);

// Profil resmini güncelle
router.put(
  "/profile/image",
  auth,
  upload.single("image"),
  usersController.updateProfileImage
);

export default router;
