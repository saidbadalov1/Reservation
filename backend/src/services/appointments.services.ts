import {
  Appointment,
  AppointmentStatus,
  IAppointment,
} from "../models/appointment.model";
import { User, IUser } from "../models/user.model";
import { Notification } from "../models/notification.model";
import { Comment } from "../models/comment.model";

// Bildirim gönderme yardımcı fonksiyonu
const sendNotification = async (
  userId: string,
  title: string,
  message: string
) => {
  try {
    // Bildirim tablosuna kayıt
    await Notification.create({
      userId,
      title,
      message,
      isRead: false,
    });

    // Mobil bildirim gönderimi burada yapılabilir (Firebase veya başka bir servis ile)
    // Bu kısma mobil bildirim kodu eklenebilir

    return true;
  } catch (error) {
    console.error("Bildirim gönderimi sırasında hata:", error);
    return false;
  }
};

// Müsait tarihleri üret (şimdilik statik)
export const getAvailableDates = async (doctorId: string) => {
  const dates = [];

  // Doktor var mı kontrol et
  const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
  if (!doctor) {
    throw new Error("Doktor bulunamadı");
  }

  // Bugünden başlayarak 10 gün için müsait saatler oluştur
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    // Cumartesi ve Pazar günleri müsait değil
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Tarihi ISO formatında kaydet (YYYY-MM-DD)
    const formattedDate = date.toISOString().split("T")[0];

    // Saatler - standart çalışma saatleri
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

    // Bu tarihte zaten alınmış randevuları bul
    const existingAppointments = await Appointment.find({
      doctorId,
      date: formattedDate,
      status: { $ne: "cancelled" }, // İptal edilenler hariç
    });

    // Alınmış saatleri müsait saatlerden çıkar
    const bookedTimes = existingAppointments.map((app) => app.time);
    const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

    dates.push({
      date: formattedDate,
      slots: availableSlots,
    });
  }

  return dates;
};

// Yeni randevu oluştur
export const createAppointment = async (
  patientId: string,
  doctorId: string,
  date: string,
  time: string,
  reason?: string
) => {
  // Doktor kontrolü
  const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
  if (!doctor) {
    throw new Error("Doktor bulunamadı");
  }

  // Hastanın aktif randevu sayısını kontrol et
  const activeAppointments = await Appointment.countDocuments({
    patientId,
    status: { $in: ["pending", "confirmed"] },
  });

  if (activeAppointments >= 3) {
    throw new Error(
      "Maksimum 3 aktif randevunuz olabilir. Lütfen mevcut randevularınızı tamamlayın veya iptal edin."
    );
  }

  // Seçilen tarih ve saatte aktif randevu var mı kontrol et
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $ne: "cancelled" }, // İptal edilmiş randevuları hariç tut
  });

  if (existingAppointment) {
    throw new Error("Bu tarih ve saat için aktif bir randevu zaten var");
  }

  // Yeni randevu oluştur
  const appointment = new Appointment({
    doctorId,
    patientId,
    date,
    time,
    status: "pending",
    reason,
  });

  await appointment.save();

  // Doktora bildirim gönder
  await sendNotification(
    doctorId,
    "Yeni Görüş Tələbi",
    `${doctor.name} adlı doktorun ${date} tarixində saat ${time}-də görüş tələb etdi.`
  );

  return appointment;
};

// Kullanıcının randevularını getir
export const getMyAppointments = async (userId: string) => {
  // Kullanıcı var mı kontrol et
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  let appointments;

  if (user.role === "patient") {
    // Hasta ise kendi randevularını getir
    appointments = await Appointment.find({ patientId: userId })
      .populate("doctorId", "name specialty image")
      .sort({ createdAt: -1 }); // Oluşturma tarihine göre azalan sıra (yeni randevular önce)
  } else if (user.role === "doctor") {
    // Doktor ise kendisine yapılan randevuları getir
    appointments = await Appointment.find({ doctorId: userId })
      .populate("patientId", "name email phone image")
      .sort({ createdAt: -1 }); // Oluşturma tarihine göre azalan sıra (yeni randevular önce)
  } else {
    throw new Error("Geçersiz kullanıcı rolü");
  }

  return appointments;
};

// Doktorun randevularını getir
export const getDoctorAppointments = async (doctorId: string) => {
  // Doktor var mı kontrol et
  const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
  if (!doctor) {
    throw new Error("Doktor bulunamadı");
  }

  // Doktora ait tüm randevuları getir ve hasta bilgileriyle doldur
  const appointments = await Appointment.find({ doctorId })
    .populate("patientId", "name email phone image")
    .sort({ createdAt: -1 }); // Oluşturma tarihine göre azalan sıra (yeni randevular önce)

  return appointments;
};

// Randevu durumunu güncelle
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  userId: string,
  userRole: string
) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Rezervasyon tapılmadı");
    }

    // Yetkilendirme kontrolü
    if (userRole === "doctor") {
      if (appointment.doctorId.toString() !== userId) {
        throw new Error("Bu rezervasyonu yeniləmək üçün səlahiyyətiniz yoxdur");
      }
    } else if (userRole === "patient") {
      if (appointment.patientId.toString() !== userId) {
        throw new Error("Bu rezervasyonu yeniləmək üçün səlahiyyətiniz yoxdur");
      }
      // Hasta sadece iptal edebilir
      if (status !== "cancelled") {
        throw new Error("Xəstələr yalnız rezervasyonu ləğv edə bilərlər");
      }
    }

    // Durum güncelleme kuralları
    if (status === "confirmed" && appointment.status !== "pending") {
      throw new Error("Yalnız gözləmədə olan rezervasyonlar təsdiqlənə bilər");
    }

    if (status === "completed" && appointment.status !== "confirmed") {
      throw new Error(
        "Yalnız təsdiqlənmiş rezervasyonlar tamamlanmış kimi işarələnə bilər"
      );
    }

    if (
      status === "cancelled" &&
      !["pending", "confirmed"].includes(appointment.status)
    ) {
      throw new Error(
        "Yalnız gözləmədə və ya təsdiqlənmiş rezervasyonlar ləğv edilə bilər"
      );
    }

    appointment.status = status;
    await appointment.save();

    return appointment;
  } catch (error: any) {
    console.error("updateAppointmentStatus error:", error);
    throw new Error(error.message || "Rezervasyon yenilənərkən xəta baş verdi");
  }
};

// Tek bir randevunun detaylarını getir
export const getAppointmentById = async (id: string, userId: string) => {
  const appointment = await Appointment.findById(id)
    .populate("doctorId", "name specialty image")
    .populate("patientId", "name email phone image");

  if (!appointment) {
    throw new Error("Rezervasyon tapılmadı");
  }

  // Yetkilendirme kontrolü
  const isDoctor = appointment.doctorId._id.toString() === userId;
  const isPatient = appointment.patientId._id.toString() === userId;

  if (!isDoctor && !isPatient) {
    throw new Error("Bu rezervasyonu görüntüləmək üçün səlahiyyətiniz yoxdur");
  }

  // Yorum kontrolü
  const hasComment = await Comment.findOne({ appointmentId: id });

  return {
    ...appointment.toObject(),
    hasComment: !!hasComment,
  };
};
