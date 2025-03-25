import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    next();
  };
}; 