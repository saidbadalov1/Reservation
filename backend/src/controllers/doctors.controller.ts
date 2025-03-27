import { RequestHandler } from "express";
import { User, DoctorSpecialty } from "../models/user.model";
import * as doctorsService from "../services/doctors.services";
import { Rating } from "../models/ratings.model";
import mongoose from "mongoose";

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
    const {
      specialty: specialtyQuery,
      page = "1",
      limit = "10",
      sort,
      searchQuery,
    } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Query oluştur
    let query: any = { role: "doctor" };

    // Uzmanlık filtresi
    if (specialtyQuery && specialtyQuery !== "Hamısı") {
      query.specialty = specialtyQuery;
    }

    // Search filter
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { specialty: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Toplam doktor sayısını al
    const total = await User.countDocuments(query);

    // Aggregate pipeline oluştur
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "doctorId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "doctorId",
          as: "comments",
        },
      },
      {
        $addFields: {
          rating: {
            $cond: {
              if: { $eq: [{ $size: "$ratings" }, 0] },
              then: 0,
              else: { $avg: "$ratings.rating" },
            },
          },
          reviews: { $size: "$comments" },
        },
      },
      {
        $project: {
          password: 0,
          ratings: 0,
          comments: 0,
          __v: 0,
        },
      },
    ];

    // Sıralama ekle
    if (sort === "rating") {
      pipeline.push({ $sort: { rating: -1 } });
    }

    // Sayfalama ekle
    pipeline.push({ $skip: skip }, { $limit: limitNumber });

    const doctors = await User.aggregate(pipeline);

    // ID dönüşümü
    const doctorsWithFormattedIds = doctors.map((doctor) => ({
      ...doctor,
      id: doctor._id,
      _id: undefined,
    }));

    res.json({
      doctors: doctorsWithFormattedIds,
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

    res.json({
      data: {
        ...doctor,
        id: doctor._id,
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

        return {
          ...doctor,
          id: doctor._id,
        };
      })
    );

    res.json({ data: doctorsWithData });
  } catch (error) {
    next(error);
  }
};
