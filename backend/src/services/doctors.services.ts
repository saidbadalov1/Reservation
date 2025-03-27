import { User } from "../models/user.model";

export const getDoctors = async () => {
  const doctors = await User.find({ role: "doctor" })
    .select(
      "name email phone specialty rating reviews image createdAt updatedAt"
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
      "name email phone specialty rating reviews image createdAt updatedAt"
    )
    .lean();
  if (!doctor) return null;

  // _id'yi id'ye dönüştür ve reviews ekle
  const { _id, ...rest } = doctor;
  return {
    data: {
      id: _id,
      ...rest,
    },
  };
};

export const searchDoctors = async (query: string) => {
  const doctors = await User.find({
    role: "doctor",
    name: { $regex: query, $options: "i" },
  })
    .select(
      "name email phone specialty rating reviews image createdAt updatedAt"
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
