import { Router, Request, Response, NextFunction } from "express";
import * as appointmentsController from "../controllers/appointments.controller";
import { auth } from "../middlewares/auth.middleware";

// AuthRequest arayüzünü tanımla
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = Router();

// Müsait randevu tarihlerini getir (herkes erişebilir)
router.get("/available/:doctorId", (req: Request, res: Response) => {
  appointmentsController.getAvailableDates(req, res);
});

// Randevu oluştur (sadece hastalar)
router.post(
  "/",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    // Sadece hastalar randevu oluşturabilir
    if (req.user && req.user.role !== "patient") {
      res
        .status(403)
        .json({ message: "Sadece hastalar randevu oluşturabilir" });
      return;
    }
    appointmentsController.createAppointment(req, res, next);
  }
);

// Kendi randevularını getir (hasta ve doktorlar)
router.get(
  "/my",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    appointmentsController.getMyAppointments(req, res, next);
  }
);

// Doktor randevularını getir (sadece doktorlar)
router.get(
  "/doctor",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    // Sadece doktorlar erişebilir
    if (req.user && req.user.role !== "doctor") {
      res.status(403).json({
        message: "Sadece doktorlar kendi randevularını görüntüleyebilir",
      });
      return;
    }
    appointmentsController.getMyAppointments(req, res, next);
  }
);

// Randevu durumunu güncelle (İptal: hasta ve doktor, Onay ve Tamamlama: sadece doktor)
router.put(
  "/:appointmentId/status",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const { status } = req.body;

    if (status === "cancel") {
      // İptal işlemi - herkes yapabilir
      appointmentsController.updateAppointmentStatus(req, res);
    } else if (status === "confirm") {
      // Onaylama işlemi - sadece doktor
      req.body.status = "confirmed";
      if (req.user && req.user.role !== "doctor") {
        res
          .status(403)
          .json({ message: "Sadece doktorlar randevuları onaylayabilir" });
        return;
      }
      appointmentsController.updateAppointmentStatus(req, res);
    } else if (status === "complete") {
      req.body.status = "completed";
      // Tamamlama işlemi - sadece doktor
      if (req.user && req.user.role !== "doctor") {
        res
          .status(403)
          .json({ message: "Sadece doktorlar randevuları tamamlayabilir" });
        return;
      }
      appointmentsController.updateAppointmentStatus(req, res);
    } else if (status === "reject") {
      // Reddetme işlemi - sadece doktor
      req.body.status = "rejected";
      if (req.user && req.user.role !== "doctor") {
        res
          .status(403)
          .json({ message: "Sadece doktorlar randevuları reddedebilir" });
        return;
      }
      appointmentsController.updateAppointmentStatus(req, res);
    } else {
      res.status(400).json({
        message:
          "Geçersiz durum. İzin verilen durumlar: cancelled, confirmed, completed, rejected",
      });
    }
  }
);

// Tek bir randevunun detaylarını getir
router.get(
  "/:id",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    appointmentsController.getAppointmentById(req, res, next);
  }
);

export default router;
