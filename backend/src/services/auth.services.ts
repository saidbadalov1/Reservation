import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, DoctorSpecialty } from "../models/user.model";

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  specialty?: DoctorSpecialty;
  phone: string;
}

export const register = async ({
  name,
  email,
  password,
  role,
  specialty,
  phone,
}: RegisterParams) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Bu email adresi zaten kullanımda");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialty,
      phone,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET ||
        "your-super-secret-key-change-this-in-production",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        phone: user.phone,
        image: user.image,
        rating: user.rating,
        reviews: user.reviews,
      },
    };
  } catch (error) {
    throw error;
  }
};
