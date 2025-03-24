import * as Yup from "yup";

// Azerbaycan telefon numarası validasyonu için regex paterni
export const azerbaijanPhoneRegex = /^(055|051|050|070|077|099)\d{7}$/;

// Telefon numarası formatlama fonksiyonu - sadece rakamları kabul eder
export const formatPhoneNumber = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

// Telefon numarası için Yup validasyon şeması
export const phoneValidationSchema = Yup.string()
  .required("Telefon nömrəsi tələb olunur")
  .matches(
    azerbaijanPhoneRegex,
    "Telefon nömrəsi 055, 051, 050, 070, 077 və ya 099 ilə başlamalı və 10 rəqəmdən ibarət olmalıdır"
  );

// Telefon numarası örnek formatı
export const phoneNumberPlaceholder = "0551234567";

// Maksimum telefon numarası uzunluğu
export const maxPhoneLength = 10;
