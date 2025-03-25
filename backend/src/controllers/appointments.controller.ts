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
import { DoctorSettingsService } from "../services/doctor.settings.service";
import {
  format,
  parse,
  addMinutes,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentDate {
  date: string;
  slots: TimeSlot[];
  appointmentDuration: number;
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

    // Doktor ayarlarını al
    const settings = await DoctorSettingsService.getSettings(doctorId);
    if (!settings) {
      return res.status(404).json({ message: "Doktor ayarları bulunamadı" });
    }

    const dates: AppointmentDate[] = [];
    const now = new Date(); // Şu anki zaman
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Haftanın günü için çalışma saatlerini bul
      const dayOfWeek = currentDate.getDay();
      const workingHour = settings.workingHours.find(
        (wh) => wh.dayOfWeek === dayOfWeek
      );

      // Eğer çalışma günü değilse veya kapalı ise atla
      if (!workingHour || workingHour.isWorkingDay === false) {
        continue;
      }

      const formattedDate = format(currentDate, "yyyy-MM-dd");

      // O güne ait randevuları kontrol et
      const existingAppointments = await Appointment.find({
        doctorId,
        date: formattedDate,
        status: { $ne: "cancelled" },
      }).lean();

      // Çalışma saatleri arasındaki tüm slotları oluştur
      const slots = [];
      const startTime = parse(workingHour.startTime, "HH:mm", currentDate);
      const endTime = parse(workingHour.endTime, "HH:mm", currentDate);
      let currentSlot = startTime;

      while (currentSlot < endTime) {
        const timeStr = format(currentSlot, "HH:mm");
        const slotDateTime = parse(timeStr, "HH:mm", currentDate);

        // Eğer bugünse ve slot zamanı geçmişse, bu slotu atla
        if (isSameDay(currentDate, now) && isBefore(slotDateTime, now)) {
          currentSlot = addMinutes(currentSlot, settings.appointmentDuration);
          continue;
        }

        // Bu slot bloke edilmiş mi kontrol et
        const isBlocked = settings.blockedTimeSlots.some(
          (blockedSlot) =>
            format(blockedSlot.date, "yyyy-MM-dd") === formattedDate &&
            blockedSlot.time === timeStr
        );

        // Bu slotta randevu var mı kontrol et
        const hasAppointment = existingAppointments.some(
          (app) => app.time === timeStr
        );

        // Eğer slot müsaitse ekle
        if (!isBlocked && !hasAppointment) {
          slots.push({
            time: timeStr,
            available: true,
          });
        } else {
          slots.push({
            time: timeStr,
            available: false,
          });
        }

        // Bir sonraki slot için randevu süresi kadar ilerle
        currentSlot = addMinutes(currentSlot, settings.appointmentDuration);
      }

      // Eğer o gün için müsait slot varsa tarihi ekle
      if (slots.length > 0) {
        dates.push({
          date: formattedDate,
          slots,
          appointmentDuration: settings.appointmentDuration,
        });
      }
    }

    res.json({
      availableDates: dates,
      appointmentDuration: settings.appointmentDuration,
    });
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
