import { Gender } from "./user.types";

export interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: Gender;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      surname: string;
      email: string;
      phone: string;
      gender: Gender;
    };
  };
}
