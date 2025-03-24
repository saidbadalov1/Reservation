import { Request, Response } from "express";
import * as commentsService from "../services/comments.services";
import { AuthRequest } from "../types/auth";

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "İstifadəçi təsdiqlənməyib" });
    }

    if (!comment) {
      return res.status(400).json({ message: "Şərh tələb olunur" });
    }

    const newComment = await commentsService.createComment(
      appointmentId,
      userId,
      comment
    );

    res.status(201).json(newComment);
  } catch (error: any) {
    console.error("createComment error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getCommentsByDoctorId = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.id || req.params.doctorId;

    
    const comments = await commentsService.getCommentsByDoctorId(doctorId);


    res.json({ data: comments });
  } catch (error: any) {
    console.error("getCommentsByDoctorId error:", error);
    res.status(500).json({ message: error.message });
  }
};
