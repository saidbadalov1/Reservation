import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "@/store/slices/authSlice";
import { storage } from "@/services/storage.services";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/utils/globalStyles";
import { SITE_URL } from "@/config";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";
import React from "react";
import {
  formatPhoneNumber,
  maxPhoneLength,
  phoneNumberPlaceholder,
  phoneValidationSchema,
} from "@/utils/phoneValidation";
import { userService } from "@/services/user.services";

const updateProfileSchema = Yup.object().shape({
  name: Yup.string().required("Ad tələb olunur"),
  phone: phoneValidationSchema,
});

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sadece sayı girişine izin veren fonksiyon
  const handlePhoneChange = (text: string, handleChange: any) => {
    // Sadece rakamları filtrele
    const formattedValue = formatPhoneNumber(text);
    handleChange("phone")(formattedValue);
  };

  const handleLogout = async () => {
    try {
      await storage.clearAuth();
      dispatch(logout());
    } catch (error) {
      Alert.alert("Xəta", "Çıxış zamanı xəta baş verdi");
    }
  };

  const handleUpdateProfile = async (values: {
    name: string;
    phone: string;
  }) => {
    try {
      setIsSubmitting(true);
      // Backend'e güncelleme isteği gönder (bu fonksiyonu backend'de oluşturmamız gerekecek)
      const response = await userService.updateProfile(values);

      if (response && response.data.user) {
        // Redux store'u güncelle
        dispatch(updateUser(response.data.user));
        Alert.alert("Uğurlu", "Profil məlumatları yeniləndi");
        setIsEditModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Xəta", "Profil məlumatları yeniləmə zamanı xəta baş verdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    try {
      // İzinleri iste
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Xəta", "Qalereya icazəsi verilmədi");
        return;
      }

      // Galeriyi aç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Seçilen fotoğrafı state'e kaydet
        setProfileImage(result.assets[0].uri);

        // Backend'e fotoğrafı yükle
        try {
          setIsUploading(true);

          // FormData oluştur
          const formData = new FormData();
          formData.append("image", {
            uri: result.assets[0].uri,
            type: "image/jpeg",
            name: "profile-image.jpg",
          } as any);

          // Backend'e gönder
          const response = await userService.updateProfileImage(formData);

          if (response && response.data.user) {
            // Redux store'u güncelle
            dispatch(updateUser(response.data.user));
            Alert.alert("Uğurlu", "Profil fotoqrafı yeniləndi");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          Alert.alert("Xəta", "Fotoqraf yükləmə zamanı xəta baş verdi");
          // Hata durumunda, yerel profil resmi güncellemesini geri al
          setProfileImage(null);
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      Alert.alert("Xəta", "Fotoqraf seçərkən xəta yarandı");
      console.error("Error picking image:", error);
    }
  };

  const ProfileCard = ({
    icon,
    title,
    value,
  }: {
    icon: any;
    title: string;
    value: string;
  }) => (
    <View
      className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl shadow-sm flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="w-12 h-12 bg-blue-500/10 rounded-2xl justify-center items-center">
        <Ionicons name={icon} size={22} color="#3b82f6" />
      </View>
      <View className="ml-4 flex-1">
        <ThemedText size="sm" className="font-semibold" color="#6b7280">
          {title}
        </ThemedText>
        <ThemedText size="base" className="mt-1 font-semibold">
          {value}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Header Section */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          className="h-72 rounded-b-[40px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 8,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View
            style={{ marginTop: insets.top + 20 }}
            className="flex-1 justify-center items-center pb-4"
          >
            <View className="relative">
              <View
                className="bg-white p-2 w-28 h-28 rounded-full justify-center items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 16,
                  elevation: 5,
                }}
              >
                <Image
                  width={40}
                  height={50}
                  className="h-full w-full rounded-full"
                  source={{ uri: profileImage ?? SITE_URL + user?.image }}
                />
              </View>

              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-white w-9 h-9 rounded-full justify-center items-center border-2 border-blue-500"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={pickImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <View className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Ionicons name="camera-outline" size={18} color="#3b82f6" />
                )}
              </TouchableOpacity>
            </View>

            <ThemedText size="2xl" color="#ffffff" className="mt-4 font-bold">
              {user?.name}
            </ThemedText>
            <ThemedText
              size="base"
              color="rgba(255, 255, 255, 0.9)"
              className="mt-1 font-semibold"
            >
              {user?.email}
            </ThemedText>

            {/* Edit Profile Button */}
            <TouchableOpacity
              className="mt-4 bg-white/20 px-4 py-2 rounded-full flex-row items-center"
              onPress={() => setIsEditModalVisible(true)}
            >
              <Ionicons name="create-outline" size={16} color="#ffffff" />
              <ThemedText
                className="ml-1 font-semibold"
                color="#ffffff"
                size="sm"
              >
                Məlumatları Düzənlə
              </ThemedText>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={globalStyles.container} className="flex-1 pt-8">
          <View className="flex flex-col gap-y-4">
            <ProfileCard
              icon="person-outline"
              title="Ad"
              value={user?.name || ""}
            />
            <ProfileCard
              icon="mail-outline"
              title="E-poçt"
              value={user?.email || ""}
            />
            <ProfileCard
              icon="call-outline"
              title="Telefon"
              value={user?.phone || ""}
            />
            <ProfileCard
              icon="person-circle-outline"
              title="Rol"
              value={
                user?.role === "patient"
                  ? "Xəstə"
                  : user?.role === "doctor"
                  ? "Həkim"
                  : "Admin"
              }
            />
            {user?.role === "doctor" && user?.specialty && (
              <ProfileCard
                icon="medical-outline"
                title="İxtisas"
                value={user?.specialty || ""}
              />
            )}
            {user?.role === "doctor" && (
              <ProfileCard
                icon="star-outline"
                title="Reytinq"
                value={user?.rating ? user.rating.toString() : "Rəy yoxdur"}
              />
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="mt-8 mb-6 overflow-hidden flex flex-row items-center p-4 justify-center rounded-2xl bg-red-500"
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <ThemedText className="ml-2 font-bold" color="#ffffff">
              Çıxış
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
        transparent
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsEditModalVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View className="bg-white rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-6">
                  <ThemedText size="xl" className="font-bold">
                    Profil Məlumatlarını Düzənlə
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => setIsEditModalVisible(false)}
                  >
                    <Ionicons name="close-outline" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                <Formik
                  initialValues={{
                    name: user?.name || "",
                    phone: user?.phone || "",
                  }}
                  validationSchema={updateProfileSchema}
                  onSubmit={handleUpdateProfile}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View>
                      <View className="mb-4">
                        <ThemedText
                          size="sm"
                          className="font-semibold mb-2"
                          color="#6b7280"
                        >
                          Ad
                        </ThemedText>
                        <TextInput
                          className="bg-gray-50 p-4 rounded-xl text-gray-800"
                          placeholder="Adınızı daxil edin"
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
                          value={values.name}
                        />
                        {touched.name && errors.name && (
                          <ThemedText
                            size="xs"
                            color="#ef4444"
                            className="mt-1"
                          >
                            {errors.name}
                          </ThemedText>
                        )}
                      </View>

                      <View className="mb-4">
                        <ThemedText
                          size="sm"
                          className="font-semibold mb-2"
                          color="#6b7280"
                        >
                          Telefon
                        </ThemedText>
                        <TextInput
                          className="bg-gray-50 p-4 rounded-xl text-gray-800"
                          placeholder={phoneNumberPlaceholder}
                          onChangeText={(text) =>
                            handlePhoneChange(text, handleChange)
                          }
                          onBlur={handleBlur("phone")}
                          value={values.phone}
                          keyboardType="phone-pad"
                          maxLength={maxPhoneLength}
                        />
                        {touched.phone && errors.phone && (
                          <ThemedText
                            size="xs"
                            color="#ef4444"
                            className="mt-1"
                          >
                            {errors.phone}
                          </ThemedText>
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                        className={`mt-4 p-4 rounded-xl flex-row justify-center items-center ${
                          isSubmitting ? "bg-blue-300" : "bg-blue-500"
                        }`}
                      >
                        {isSubmitting ? (
                          <View className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Ionicons
                              name="save-outline"
                              size={20}
                              color="white"
                            />
                            <ThemedText className="ml-2" color="#ffffff">
                              Yadda Saxla
                            </ThemedText>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
};

export default Profile;
