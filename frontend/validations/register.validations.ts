import * as Yup from "yup";
import { phoneValidationSchema } from "@/utils/phoneValidation";
import { RegisterFormValues } from "@/types/auth.types";

export const RegisterSchema: Yup.ObjectSchema<RegisterFormValues> =
  Yup.object().shape({
    name: Yup.string().required("Ad tələb olunur"),
    surname: Yup.string().required("Soyad tələb olunur"),
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
    gender: Yup.string()
      .oneOf(["male", "female"], "Yanlış cins")
      .required("Cins tələb olunur"),
  });
