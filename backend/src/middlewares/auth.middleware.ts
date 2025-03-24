import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

interface JwtPayload {
  userId: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Autentifikasiya tələb olunur" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JwtPayload;

      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401).json({ message: "İstifadəçi tapılmadı" });
        return;
      }

      // Kullanıcı id ve rolünü isteğe ekle
      req.user = {
        id: String(user._id),
        role: user.role,
      };

      next();
    } catch (jwtError) {
      res.status(401).json({ message: "Yanlış token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Yanlış token" });
  }
};
