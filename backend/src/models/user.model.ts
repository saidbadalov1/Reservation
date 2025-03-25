import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export type DoctorSpecialty =
  | "Terapevt"
  | "Ailə həkimi"
  | "Kardioloq"
  | "Nevroloq"
  | "Psixiatr"
  | "Psixoterapevt"
  | "Uşaq psixiatrı"
  | "Pulmonoloq"
  | "Endokrinoloq"
  | "Ginekoloq"
  | "Uroloq"
  | "Nefroloq"
  | "Dermatoloq"
  | "Onkoloq"
  | "Hematoloq"
  | "Revmotoloq"
  | "Qastroenteroloq"
  | "İnfeksionist"
  | "Stomatoloq"
  | "Pediatr"
  | "Ortoped"
  | "Travmatoloq"
  | "Oftalmoloq"
  | "Otorinolarinqoloq (LOR)"
  | "Alerqoloq"
  | "İmmunoloq"
  | "Anestezioloq-reanimatoloq"
  | "Cərrah"
  | "Plastik cərrah"
  | "Ürək-damar cərrahı"
  | "Neurocərrah"
  | "Mamaginikoloq"
  | "Radioloq"
  | "Laborator həkim"
  | "Patoloq"
  | "Genetik"
  | "İş həkimi (sənaye təbabəti)"
  | "Reabilitoloq"
  | "Fizioterapevt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  specialty?: DoctorSpecialty;
  rating?: number;
  reviews?: number;
  phone?: string;
  image: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    specialty: {
      type: String,
      enum: [
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
      ],
      required: function (this: IUser) {
        return this.role === "doctor";
      },
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
      default: "/uploads/default-avatar.png",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Şifre hashleme middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>("User", userSchema);
