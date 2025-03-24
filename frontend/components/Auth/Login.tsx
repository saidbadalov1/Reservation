import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, View, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Formik } from "formik";
import { FormInput } from "@/components/FormInput";
import { LoginSchema, LoginFormValues } from "@/validations/login.validations";
import { ThemedText } from "../ThemedText";
import { authApi } from "@/services/login.services";
import { useState } from "react";
import { storage } from "@/services/storage.services";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);

      const response = await authApi.login(values.email, values.password);

      await storage.setToken(response.token);

      dispatch(
        login({
          user: response.user,
          token: response.token,
        })
      );
    } catch (error: any) {
      Alert.alert(
        "Xəta",
        error.response?.data?.message || "Giriş zamanı xəta baş verdi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <ThemedView>
          <View className="flex flex-col gap-y-4">
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
          </View>

          <TouchableOpacity
            className={`p-4 rounded-lg items-center mt-3 ${
              isLoading ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={() => handleSubmit()}
            disabled={isLoading}
          >
            <ThemedText className="!text-white text-base font-bold">
              {isLoading ? "Giriş edilir..." : "Daxil ol"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </Formik>
  );
};

export default Login;
