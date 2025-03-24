import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, View, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Formik } from "formik";
import { FormInput } from "@/components/FormInput";
import {
  RegisterSchema,
  RegisterFormValues,
} from "@/validations/register.validations";
import { ThemedText } from "../ThemedText";
import { registerApi } from "@/services/register.services";
import { useState } from "react";
import { storage } from "@/services/storage.services";
import { Picker } from "@react-native-picker/picker";
import { DoctorSpecialty } from "@/types/doctor.types";
import {
  formatPhoneNumber,
  maxPhoneLength,
  phoneNumberPlaceholder,
} from "@/utils/phoneValidation";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">(
    "patient"
  );

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
    specialty: undefined,
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const response = await registerApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: selectedRole,
        specialty: values.specialty,
        phone: values.phone,
      });

      const data = response.data;

      await storage.setToken(data.token);

      dispatch(
        login({
          user: data.user,
          token: data.token,
        })
      );
    } catch (error: any) {
      Alert.alert(
        "Xəta",
        error.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const RoleButton = ({
    role,
    title,
  }: {
    role: "patient" | "doctor";
    title: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedRole(role)}
      className={`flex-1 p-4 rounded-2xl ${
        selectedRole === role ? "bg-blue-500" : "bg-gray-100"
      }`}
    >
      <ThemedText
        className={`text-center font-semibold ${
          selectedRole === role ? "!text-white" : "text-gray-600"
        }`}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => {
        return (
          <ThemedView>
            <View className="flex flex-col gap-y-4">
              {/* Role Selection */}
              <View className="mb-2">
                <View className="flex-row gap-x-4 mt-4">
                  <RoleButton role="patient" title="Xəstə" />
                  <RoleButton role="doctor" title="Həkim" />
                </View>
              </View>

              <View>
                <FormInput
                  placeholder="Ad Soyad"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  autoCapitalize="words"
                  error={errors.name}
                  touched={touched.name}
                  editable={!isLoading}
                />
              </View>

              <View>
                <FormInput
                  placeholder="E-poçt"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  touched={touched.email}
                  editable={!isLoading}
                />
              </View>

              <View>
                <FormInput
                  placeholder={phoneNumberPlaceholder}
                  value={values.phone}
                  onChangeText={(text) => {
                    const formattedPhone = formatPhoneNumber(text);
                    handleChange("phone")(formattedPhone);
                  }}
                  onBlur={handleBlur("phone")}
                  keyboardType="phone-pad"
                  error={errors.phone}
                  touched={touched.phone}
                  editable={!isLoading}
                  maxLength={maxPhoneLength}
                />
              </View>

              <View>
                <FormInput
                  placeholder="Şifrə"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry
                  error={errors.password}
                  touched={touched.password}
                  editable={!isLoading}
                />
              </View>

              <View>
                <FormInput
                  placeholder="Şifrə təkrarı"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  secureTextEntry
                  touched={touched.confirmPassword}
                  error={errors.confirmPassword}
                  editable={!isLoading}
                />
              </View>

              {selectedRole === "doctor" && (
                <View>
                  <View className="bg-gray-100 rounded-xl px-4">
                    <Picker
                      selectedValue={values.specialty}
                      onValueChange={(value) =>
                        setFieldValue("specialty", value || undefined)
                      }
                      enabled={!isLoading}
                    >
                      <Picker.Item label="İxtisas seçin" value={undefined} />
                      {Object.entries(DoctorSpecialty).map(([key, value]) => (
                        <Picker.Item key={key} label={value} value={key} />
                      ))}
                    </Picker>
                  </View>
                  {errors.specialty && touched.specialty && (
                    <ThemedText className="mt-1 text-red-500">
                      {errors.specialty}
                    </ThemedText>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              className={`p-4 rounded-lg items-center mt-6 ${
                isLoading ? "bg-blue-300" : "bg-blue-500"
              }`}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              <ThemedText className="!text-white text-base font-bold">
                {isLoading ? "Qeydiyyatdan keçilir..." : "Qeydiyyatdan keç"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      }}
    </Formik>
  );
};

export default Register;
