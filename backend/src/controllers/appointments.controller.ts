import { Request, Response, NextFunction } from "express";
import * as appointmentsService from "../services/appointments.services";
import {
  AppointmentStatus,
  IAppointment,
  Appointment,
} from "../models/appointment.model";
import { Notification } from "../models/notification.model";
import { IUser } from "../models/user.model";
import { User } from "../models/user.model";
import { Rating } from "../models/rating.model";

interface AppointmentDate {
  date: string;
  slots: string[];
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface PopulatedAppointment
  extends Omit<IAppointment, "doctorId" | "patientId"> {
  doctorId: IUser;
  patientId: IUser;
}

// Müsait tarihleri getir
export const getAvailableDates = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    // Gelecek 30 günün tarihlerini oluştur
    const dates: AppointmentDate[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Hafta sonlarını atla
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Saat dilimlerini oluştur
      const slots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ];

      // O güne ait randevuları kontrol et
      const existingAppointments = await Appointment.find({
        doctorId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        status: { $ne: "cancelled" },
      });

      // Dolu saatleri filtrele
      const bookedSlots = existingAppointments.map(
        (app: IAppointment) => app.time
      );
      const availableSlots = slots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      if (availableSlots.length > 0) {
        dates.push({
          date: date.toISOString().split("T")[0],
          slots: availableSlots,
        });
      }
    }

    res.json({ availableDates: dates });
  } catch (error) {
    console.error("Müsait tarihler alınırken hata:", error);
    res
      .status(500)
      .json({ message: "Müsait tarihler alınırken bir hata oluştu" });
  }
};

// Yeni randevu oluştur
export const createAppointment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user?.id;

    if (!patientId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }

    if (!doctorId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Doktor ID, tarih ve saat gereklidir" });
    }

    const appointment = await appointmentsService.createAppointment(
      patientId,
      doctorId,
      date,
      time,
      reason
    );

    // Hasta bilgilerini al
    const patient = await User.findById(patientId).select("name").lean();

    // Doktora bildirim oluştur
    await Notification.create({
      userId: doctorId,
      title: "Yeni Randevu",
      message: `${patient?.name} tərəfindən ${date} tarixində saat ${time}-də yeni randevu sorğusu yaradıldı.`,
      type: "appointment",
      appointmentId: appointment._id,
      read: false,
    });

    res.status(201).json({
      id: appointment._id,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason,
      createdAt: appointment.createdAt,
    });
  } catch (error: any) {
    console.error("createAppointment error:", error);
    res.status(error.message.includes("alınmış") ? 409 : 500).json({
      message: error.message || "Randevu oluşturulurken bir hata oluştu",
    });
  }
};

// Kullanıcının randevularını getir
export const getMyAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }

    const appointments = await appointmentsService.getMyAppointments(userId);

    // Doktor/hasta bilgilerini düzenle
    const formattedAppointments = appointments.map((appointment) => {
      const {
        _id,
        doctorId,
        patientId,
        date,
        time,
        status,
        reason,
        createdAt,
      } = appointment;

      let doctor = null;
      if (req.user?.role === "patient" && doctorId) {
        // @ts-ignore
        const { _id, name, specialty, image } = doctorId;
        doctor = { id: _id, name, specialty, image };
      }

      let patient = null;
      if (req.user?.role === "doctor" && patientId) {
        // @ts-ignore
        const { _id, name, email, phone, image } = patientId;
        patient = { id: _id, name, email, phone, image };
      }

      return {
        id: _id,
        doctorId: typeof doctorId === "object" ? doctorId._id : doctorId,
        patientId: typeof patientId === "object" ? patientId._id : patientId,
        date,
        time,
        status,
        reason,
        createdAt,
        doctor,
        patient,
      };
    });

    res.json({ appointments: formattedAppointments });
  } catch (error: any) {
    console.error("getMyAppointments error:", error);
    res.status(500).json({
      message: error.message || "Randevular alınırken bir hata oluştu",
    });
  }
};

// Doktorun kendi randevularını getir
export const getDoctorAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }

    if (req.user?.role !== "doctor") {
      return res.status(403).json({
        message: "Sadece doktorlar kendi randevularını görüntüleyebilir",
      });
    }

    const appointments = await appointmentsService.getDoctorAppointments(
      userId
    );

    // Doktor ve hasta bilgilerini düzenle
    const formattedAppointments = appointments.map((appointment: any) => {
      const {
        _id,
        doctorId,
        patientId,
        date,
        time,
        status,
        reason,
        createdAt,
      } = appointment;

      let patient = null;
      if (patientId) {
        // @ts-ignore
        const { _id, name, email, phone, image } = patientId;
        patient = { id: _id, name, email, phone, image };
      }

      return {
        id: _id,
        doctorId: typeof doctorId === "object" ? doctorId._id : doctorId,
        patientId: typeof patientId === "object" ? patientId._id : patientId,
        date,
        time,
        status,
        reason,
        createdAt,
        patient,
      };
    });

    res.json({ appointments: formattedAppointments });
  } catch (error: any) {
    console.error("getDoctorAppointments error:", error);
    res.status(500).json({
      message: error.message || "Doktor randevuları alınırken bir hata oluştu",
    });
  }
};

// Randevu durumunu güncelle
export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ message: "İstifadəçi təsdiqlənməyib" });
    }

    if (!appointmentId || !status) {
      return res
        .status(400)
        .json({ message: "Rezervasyon ID və status tələb olunur" });
    }



    const appointment = await appointmentsService.updateAppointmentStatus(
      appointmentId,
      status as AppointmentStatus,
      userId.toString(),
      userRole
    );

    res.json(appointment);
  } catch (error: any) {
    console.error("Rezervasyon yenilənərkən xəta:", error);
    res.status(400).json({ message: error.message });
  }
};

// Tek bir randevunun detaylarını getir
export const getAppointmentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }

    if (!id) {
      return res.status(400).json({ message: "Randevu ID'si gereklidir" });
    }

    const appointment = await appointmentsService.getAppointmentById(
      id,
      userId
    );

    if (!appointment) {
      return res.status(404).json({ message: "Randevu bulunamadı" });
    }

    // Doktor ve hasta bilgilerini düzenle
    const { _id, doctorId, patientId, date, time, status, reason, createdAt } =
      appointment;

    let doctor = null;
    let patient = null;

    if (doctorId) {
      // @ts-ignore
      const { _id, name, specialty, image } = doctorId;
      doctor = { id: _id, name, specialty, image };
    }

    if (patientId) {
      // @ts-ignore
      const { _id, name, email, phone, image } = patientId;
      patient = { id: _id, name, email, phone, image };
    }

    // Rating kontrolü
    const hasRating = await Rating.findOne({ appointmentId: id });

    const formattedAppointment = {
      id: _id,
      doctorId: typeof doctorId === "object" ? doctorId._id : doctorId,
      patientId: typeof patientId === "object" ? patientId._id : patientId,
      date,
      time,
      status,
      reason,
      createdAt,
      hasRating: !!hasRating, // Rating verilip verilmediği
      // Kullanıcının rolüne göre farklı bilgiler göster
      ...(userRole === "patient" ? { doctor } : {}),
      ...(userRole === "doctor" ? { patient } : {}),
    };

    res.json({ success: true, data: formattedAppointment });
  } catch (error: any) {
    console.error("getAppointmentById error:", error);
    res.status(500).json({
      message: error.message || "Randevu detayları alınırken bir hata oluştu",
    });
  }
};
