import { DoctorSpecialty } from "@/types/doctor.types";
import * as Yup from "yup";
import { phoneValidationSchema } from "@/utils/phoneValidation";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: "patient" | "doctor";
  specialty?: DoctorSpecialty;
}

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Ad tələb olunur"),
  email: Yup.string()
    .email("Düzgün email daxil edin")
    .required("Email tələb olunur"),
  password: Yup.string()
    .min(6, "Şifrə ən az 6 simvol olmalıdır")
    .required("Şifrə tələb olunur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifrələr eyni olmalıdır")
    .required("Şifrənin təkrarı tələb olunur"),
  phone: phoneValidationSchema,
  role: Yup.string().oneOf(["patient", "doctor"]).required("Rol tələb olunur"),
  specialty: Yup.string().when("role", {
    is: "doctor",
    then: () => Yup.string().required("İxtisas tələb olunur"),
  }),
});
