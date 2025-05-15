import { DoctorSpecialty } from "./doctor.types";

export type Gender = "male" | "female";

export interface ILocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export type Language = "az" | "en" | "ru" | "tr";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  image?: string;
  role?: "patient" | "doctor" | "admin";
  // Doctor specific fields
  specialty?: DoctorSpecialty;
  gender?: Gender;
  hospital?: {
    name: string;
    location: ILocation;
  };
  education?: string[];
  experience?: number;
  languages?: Language[];
  rating?: number;
  reviews?: number;
}
