import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Formik } from "formik";
import { FormInput } from "@/components/FormElements/FormInput";
import { RegisterSchema } from "@/validations/register.validations";
import { ThemedText } from "../ThemedText";
import { registerApi } from "@/services/register.services";
import { useState } from "react";
import { storage } from "@/services/storage.services";
import {
  formatPhoneNumber,
  maxPhoneLength,
  phoneNumberPlaceholder,
} from "@/utils/phoneValidation";
import { RegisterFormValues } from "@/types/auth.types";
import { login } from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: RegisterFormValues = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "male",
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const response = await registerApi.register(values);
      const data = response.data;
      await storage.setToken(data.token);

      dispatch(
        login({
          user: data.user,
          token: data.token,
        })
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Xəta",
        error.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        values,
        errors,
        touched,
        setFieldValue,
      }) => {
        return (
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <ThemedView className="flex-1">
              {/* Form Container */}
              <View className="flex flex-col gap-y-4">
                {/* Name and Surname */}
                <View className="flex flex-row gap-x-4">
                  <View className="flex-1">
                    <FormInput
                      placeholder="Ad"
                      withLabel="Ad"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      autoCapitalize="words"
                      error={errors.name}
                      touched={touched.name}
                      editable={!isLoading}
                      leftIcon={
                        <MaterialCommunityIcons
                          name="account"
                          size={20}
                          color="#6B7280"
                        />
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <FormInput
                      placeholder="Soyad"
                      withLabel="Soyad"
                      value={values.surname}
                      onChangeText={handleChange("surname")}
                      onBlur={handleBlur("surname")}
                      autoCapitalize="words"
                      error={errors.surname}
                      touched={touched.surname}
                      editable={!isLoading}
                      leftIcon={
                        <MaterialCommunityIcons
                          name="account"
                          size={20}
                          color="#6B7280"
                        />
                      }
                    />
                  </View>
                </View>

                {/* Email */}
                <View>
                  <FormInput
                    withLabel="E-poçt"
                    placeholder="E-poçt ünvanınız"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    touched={touched.email}
                    editable={!isLoading}
                    leftIcon={
                      <MaterialCommunityIcons
                        name="email"
                        size={20}
                        color="#6B7280"
                      />
                    }
                  />
                </View>

                {/* Phone */}
                <View>
                  <FormInput
                    withLabel="Telefon"
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
                    leftIcon={
                      <MaterialCommunityIcons
                        name="phone"
                        size={20}
                        color="#6B7280"
                      />
                    }
                  />
                </View>

                {/* Gender Selection */}
                <View className="mb-2">
                  <ThemedText
                    className="text-gray-900 mb-3 ml-1"
                    weight="medium"
                  >
                    Cinsiniz
                  </ThemedText>
                  <View className="flex-row gap-x-4">
                    <TouchableOpacity
                      onPress={() => {
                        setFieldValue("gender", "male");
                      }}
                      className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                        values.gender === "male"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-gray-50/50 border-gray-100"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="gender-male"
                        size={20}
                        color={values.gender === "male" ? "#fff" : "#6B7280"}
                        style={{ marginRight: 8 }}
                      />
                      <ThemedText
                        weight="medium"
                        className={`${
                          values.gender === "male"
                            ? "!text-white"
                            : "text-gray-600"
                        }`}
                      >
                        Kişi
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setFieldValue("gender", "female");
                      }}
                      className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                        values.gender === "female"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-gray-50/50 border-gray-100"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="gender-female"
                        size={20}
                        color={values.gender === "female" ? "#fff" : "#6B7280"}
                        style={{ marginRight: 8 }}
                      />
                      <ThemedText
                        weight="medium"
                        className={`${
                          values.gender === "female"
                            ? "!text-white"
                            : "text-gray-600"
                        }`}
                      >
                        Qadın
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  {errors.gender && touched.gender && (
                    <ThemedText className="text-red-500 text-sm mt-2 ml-1">
                      {errors.gender}
                    </ThemedText>
                  )}
                </View>

                {/* Password */}
                <View>
                  <FormInput
                    placeholder="Şifrə"
                    withLabel="Şifrə"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry
                    error={errors.password}
                    touched={touched.password}
                    editable={!isLoading}
                    leftIcon={
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color="#6B7280"
                      />
                    }
                  />
                </View>

                {/* Confirm Password */}
                <View>
                  <FormInput
                    withLabel="Şifrə təkrarı"
                    placeholder="Şifrə təkrarı"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    secureTextEntry
                    touched={touched.confirmPassword}
                    error={errors.confirmPassword}
                    editable={!isLoading}
                    leftIcon={
                      <MaterialCommunityIcons
                        name="lock-check"
                        size={20}
                        color="#6B7280"
                      />
                    }
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className={`p-4 rounded-xl items-center mt-6 ${
                  isLoading ? "bg-blue-300" : "bg-blue-500"
                }`}
                onPress={() => handleSubmit()}
                disabled={isLoading}
              >
                <ThemedText weight="bold" className="!text-white text-base">
                  {isLoading ? "Qeydiyyatdan keçilir..." : "Qeydiyyatdan keç"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        );
      }}
    </Formik>
  );
};

export default Register;
