import { RequestHandler } from "express";
import { User, DoctorSpecialty } from "../models/user.model";
import * as doctorsService from "../services/doctors.services";
import { Rating } from "../models/rating.model";
import mongoose from "mongoose";
import { Comment } from "../models/comment.model";

const specialties: DoctorSpecialty[] = [
  "Terapevt",
  "Ailə həkimi",
  "Kardioloq",
  "Nevroloq",
  "Psixiatr",
  "Psixoterapevt",
  "Uşaq psixiatrı",
  "Pulmonoloq",
  "Endokrinoloq",
  "Ginekoloq",
  "Uroloq",
  "Nefroloq",
  "Dermatoloq",
  "Onkoloq",
  "Hematoloq",
  "Revmotoloq",
  "Qastroenteroloq",
  "İnfeksionist",
  "Stomatoloq",
  "Pediatr",
  "Ortoped",
  "Travmatoloq",
  "Oftalmoloq",
  "Otorinolarinqoloq (LOR)",
  "Alerqoloq",
  "İmmunoloq",
  "Anestezioloq-reanimatoloq",
  "Cərrah",
  "Plastik cərrah",
  "Ürək-damar cərrahı",
  "Neurocərrah",
  "Mamaginikoloq",
  "Radioloq",
  "Laborator həkim",
  "Patoloq",
  "Genetik",
  "İş həkimi (sənaye təbabəti)",
  "Reabilitoloq",
  "Fizioterapevt",
];

export const getSpecialties: RequestHandler = async (req, res) => {
  try {
    const specialties = await doctorsService.getSpecialties();
    res.json({ specialties });
  } catch (error) {
    res
      .status(500)
      .json({ message: "İxtisasları əldə edərkən xəta baş verdi" });
  }
};

export const getDoctors: RequestHandler = async (req, res, next) => {
  try {
    const { specialty, page = "1", limit = "10", sort, available } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Query oluştur
    let query: any = { role: "doctor" };

    // Uzmanlık filtresi
    if (specialty && specialty !== "Hamısı") {
      query.specialty = specialty;
    }

    // Müsaitlik filtresi
    if (available !== undefined) {
      // String "true" veya "false" değerini boolean'a çevir
      query.available = available === "true";
    }

    // Toplam doktor sayısını al
    const total = await User.countDocuments(query);

    // Sayfalanmış doktorları al
    const doctors = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Her doktor için rating ve reviews'ı hesapla
    const doctorsWithRatingAndReviews = await Promise.all(
      doctors.map(async (doctor) => {
        // Rating hesapla
        const ratings = await Rating.find({ doctorId: doctor._id });
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) /
              ratings.length
            : 0;

        // Yorum sayısını hesapla
        const reviews = await Comment.countDocuments({ doctorId: doctor._id });

        return {
          ...doctor,
          id: doctor._id,
          rating: averageRating,
          reviews
        };
      })
    );

    // Rating'e göre sıralama
    if (sort === "rating") {
      doctorsWithRatingAndReviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    res.json({
      doctors: doctorsWithRatingAndReviews,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasMore: skip + doctors.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;


    // ID'yi ObjectId'ye çevir
    const objectId = new mongoose.Types.ObjectId(id);


    const doctor = await User.findOne({
      _id: objectId,
      role: "doctor",
    })
      .select("-password")
      .lean();



    if (!doctor) {
      res.status(404).json({ message: "Həkim tapılmadı" });
      return;
    }

    // Doktorun rating'ini hesapla
    const ratings = await Rating.find({ doctorId: objectId });


    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        : 0;

    // Yorumları say
    const reviews = await Comment.countDocuments({ doctorId: objectId });

    res.json({
      data: {
        ...doctor,
        id: doctor._id,
        rating: averageRating,
        reviews
      },
    });
  } catch (error) {
    console.error("Doktor detayları alınırken hata:", error);
    res
      .status(500)
      .json({ message: "Həkim məlumatlarını əldə edərkən xəta baş verdi" });
  }
};

export const searchDoctors: RequestHandler = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: "Axtarış sorğusu tələb olunur" });
      return;
    }

    const doctors = await User.find({
      role: "doctor",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { specialty: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .lean();

    // Her doktor için rating ve reviews'ı hesapla
    const doctorsWithData = await Promise.all(
      doctors.map(async (doctor) => {
        // Rating hesapla
        const ratings = await Rating.find({ doctorId: doctor._id });
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
            : 0;

        // Yorum sayısını hesapla
        const reviews = await Comment.countDocuments({ doctorId: doctor._id });

        return {
          ...doctor,
          id: doctor._id,
          rating: averageRating,
          reviews
        };
      })
    );

    res.json({ data: doctorsWithData });
  } catch (error) {
    next(error);
  }
};
