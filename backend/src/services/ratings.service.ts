import { Rating } from "../models/ratings.model";
import { User } from "../models/user.model";

interface PopulatedRating {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}

export const getDoctorRatings = async (doctorId: string) => {
  try {
    // Get all ratings for the doctor
    const ratings = await Rating.find({ doctorId })
      .populate<{ patientId: PopulatedRating["patientId"] }>(
        "patientId",
        "name image"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
        : 0;

    // Format the response
    const formattedRatings = {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: totalRatings,
      reviews: ratings.map((rating) => ({
        id: rating._id.toString(),
        userName: rating.patientId.name,
        userImage: rating.patientId.image,
        rating: rating.rating,
        comment: rating.comment,
        date: rating.createdAt,
      })),
    };

    return formattedRatings;
  } catch (error) {
    throw new Error("Həkim rəyləri alınarkən xəta baş verdi");
  }
};

export const createRating = async (
  appointmentId: string,
  doctorId: string,
  patientId: string,
  rating: number,
  comment: string
) => {
  try {
    // Check if rating already exists for this appointment
    const existingRating = await Rating.findOne({ appointmentId });
    if (existingRating) {
      throw new Error("Bu görüş üçün artıq rəy bildirmisiniz");
    }

    // Create new rating
    const newRating = await Rating.create({
      appointmentId,
      doctorId,
      patientId,
      rating,
      comment,
    });

    // Update doctor's average rating
    const allRatings = await Rating.find({ doctorId });
    const averageRating =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;

    await User.findByIdAndUpdate(doctorId, {
      rating: Number(averageRating.toFixed(1)),
      reviews: allRatings.length,
    });

    return newRating;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Rəy yaradılarkən xəta baş verdi");
  }
};
