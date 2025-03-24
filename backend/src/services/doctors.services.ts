import { User } from "../models/user.model";
import { Comment } from "../models/comment.model";

export const getDoctors = async () => {
  const doctors = await User.find({ role: "doctor" })
    .select(
      "name email phone specialty available rating reviews image createdAt updatedAt"
    )
    .lean();

  // _id'yi id'ye dönüştür
  return doctors.map((doctor) => {
    const { _id, ...rest } = doctor;
    return { id: _id, ...rest };
  });
};

export const getDoctorById = async (id: string) => {
  const doctor = await User.findOne({ _id: id, role: "doctor" })
    .select(
      "name email phone specialty available rating reviews image createdAt updatedAt"
    )
    .lean();
  if (!doctor) return null;

  // Yorumları say
  const reviews = await Comment.countDocuments({ doctorId: id });

  // _id'yi id'ye dönüştür ve reviews ekle
  const { _id, ...rest } = doctor;
  return { 
    data: {
      id: _id, 
      ...rest,
      reviews 
    }
  };
};

export const searchDoctors = async (query: string) => {
  const doctors = await User.find({
    role: "doctor",
    name: { $regex: query, $options: "i" },
  })
    .select(
      "name email phone specialty available rating reviews image createdAt updatedAt"
    )
    .lean();

  // _id'yi id'ye dönüştür
  return doctors.map((doctor) => {
    const { _id, ...rest } = doctor;
    return { id: _id, ...rest };
  });
};

export const getSpecialties = async () => {
  const doctors = await User.find({ role: "doctor" }).distinct("specialty");
  return doctors;
};

export const getDoctorComments = async (doctorId: string) => {
  const comments = await Comment.find({ doctorId })
    .populate("patientId", "name image")
    .sort({ createdAt: -1 })
    .lean();

  return comments;
};
