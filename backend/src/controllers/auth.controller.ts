import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User, DoctorSpecialty } from "../models/user.model";
import * as authService from "../services/auth.services";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-this-in-production";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  specialty?: DoctorSpecialty;
  phone: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Token'dan user ID'sini çıkaran yardımcı fonksiyon
const getUserIdFromToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token təqdim edilməyib" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const userId = getUserIdFromToken(token);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "İstifadəçi tapılmadı" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        image: user.image,
        rating: user.rating,
        reviews: user.reviews,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid token") {
      res.status(401).json({ message: "Etibarsız token" });
      return;
    }
    next(error);
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role, specialty, phone } =
      req.body as RegisterBody;

    if (!name || !email || !password || !role || !phone) {
      res.status(400).json({
        success: false,
        message: "Tüm alanları doldurun",
      });
      return;
    }

    if (role === "doctor" && !specialty) {
      res.status(400).json({
        success: false,
        message: "Həkim üçün ixtisas seçilməlidir",
      });
      return;
    }

    const result = await authService.register({
      name,
      email,
      password,
      role,
      specialty,
      phone,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Qeydiyyat xətası:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Qeydiyyat zamanı xəta baş verdi",
    });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginBody;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Yanlış e-poçt və ya şifrə" });
      return;
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: "Yanlış e-poçt və ya şifrə" });
      return;
    }

    // JWT token oluştur
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        image: user.image,
        rating: user.rating,
        reviews: user.reviews,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};
