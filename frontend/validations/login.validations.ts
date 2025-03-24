import * as Yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Düzgün e-poçt ünvanı daxil edin")
    .required("E-poçt ünvanı tələb olunur"),
  password: Yup.string()
    .min(6, "Şifrə ən azı 6 simvol olmalıdır")
    .required("Şifrə tələb olunur"),
});
