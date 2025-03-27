export interface Rating {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DoctorRating {
  averageRating: number;
  totalReviews: number;
  reviews: Rating[];
}
