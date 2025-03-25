import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import * as fs from "fs";
import * as path from "path";

// Request tipini genişlet
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
  file?: Express.Multer.File;
}

// Profil resmini güncelleme
export const updateProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Faylı təqdim edin" });
      return;
    }

    const userId = req.user?.id; // Auth middleware'den gelen user.id

    if (!userId) {
      // Dosyayı sil
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(401).json({ message: "İcazə yoxdur" });
      return;
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      // Dosyayı sil
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(404).json({ message: "İstifadəçi tapılmadı" });
      return;
    }

    // Eski profil resmini silmek için kontrol et
    const oldImagePath = path.join(
      __dirname,
      "../../public",
      user.image.replace("/uploads/", "")
    );

    if (fs.existsSync(oldImagePath) && !user.image.includes("default-avatar")) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (error) {
        console.error("Köhnə şəkli silmək alınmadı:", error);
      }
    }

    // Yeni profil resminin yolunu kullanıcı nesnesine kaydet
    const relativePath = `/uploads/${req.file.filename}`;
    user.image = relativePath;

    // Kullanıcıyı kaydet
    await user.save();

    // Güncellenen kullanıcı nesnesini döndür
    res.status(200).json({
      success: true,
      message: "Profil fotoqrafı uğurla yeniləndi",
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
    // Hata durumunda dosyayı sil
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

// Profil bilgilerini getir
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id; // Auth middleware'den gelen user.id

    if (!userId) {
      res.status(401).json({ message: "İcazə yoxdur" });
      return;
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "İstifadəçi tapılmadı" });
      return;
    }

    // Kullanıcı nesnesini döndür
    res.status(200).json({
      success: true,
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
    next(error);
  }
};

// Profil bilgilerini güncelleme
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "İcazə yoxdur" });
      return;
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "İstifadəçi tapılmadı" });
      return;
    }

    // Güncellenecek alanları kontrol et
    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Kullanıcıyı kaydet
    await user.save();

    // Güncellenen kullanıcı nesnesini döndür
    res.status(200).json({
      success: true,
      message: "Profil məlumatları uğurla yeniləndi",
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
    console.error("Update profile error:", error);
    next(error);
  }
};
