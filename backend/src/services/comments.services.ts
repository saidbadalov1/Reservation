import { Comment, IComment } from "../models/comment.model";
import { Appointment } from "../models/appointment.model";

export const createComment = async (
  appointmentId: string,
  userId: string,
  comment: string
) => {
  // Randevuyu bul
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new Error("Rezervasyon tapılmadı");
  }

  // Randevu tamamlanmış mı kontrol et
  if (appointment.status !== "completed") {
    throw new Error("Yalnız tamamlanmış rezervasyonlar üçün şərh yazıla bilər");
  }

  // Hasta kendi randevusuna yorum yapabilir
  if (appointment.patientId.toString() !== userId) {
    throw new Error("Bu rezervasyon üçün şərh yazmaq səlahiyyətiniz yoxdur");
  }

  // Daha önce yorum yapılmış mı kontrol et
  const existingComment = await Comment.findOne({ appointmentId });
  if (existingComment) {
    throw new Error("Bu rezervasyon üçün artıq şərh yazılıb");
  }

  // Yorum oluştur
  const newComment = new Comment({
    appointmentId,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    comment,
  });

  await newComment.save();

  return newComment;
};

export const getCommentsByDoctorId = async (doctorId: string) => {

  
  const comments = await Comment.find({ doctorId })
    .populate<{ patientId: { name: string; image?: string } }>({
      path: "patientId",
      select: "name image"
    })
    .select("_id comment createdAt patientId")
    .sort({ createdAt: -1 })
    .lean();


  
  // Frontend'in beklediği formata dönüştür
  const formattedComments = comments.map(comment => ({
    _id: comment._id.toString(),
    comment: comment.comment,
    createdAt: comment.createdAt,
    patientId: {
      name: comment.patientId?.name || 'İsimsiz',
      image: comment.patientId?.image
    }
  }));


  return formattedComments;
};

export const hasComment = async (appointmentId: string) => {
  const comment = await Comment.findOne({ appointmentId });
  return !!comment;
};
