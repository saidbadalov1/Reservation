import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Header } from "@/components/ui/Header";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { appointmentsApi } from "@/services/appointments.services";
import { SITE_URL } from "@/config";
import { updateAppointment } from "@/store/slices/appointmentsSlice";

import { StarIcon } from "react-native-heroicons/outline";
import { StarIcon as StarIconSolid } from "react-native-heroicons/solid";
import { commentsApi } from "../../services/comments.services";
import { RatingModal } from "@/components/Modals/RatingModal";
import { ratingsApi } from "@/services/ratings.services";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reason?: string;
  createdAt: string;
  hasRating: boolean;
  hasComment: boolean;
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    image?: string;
  };
  patient?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
  };
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRating, setIsRating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentsApi.getAppointmentById(id as string);
      setAppointment(response);
    } catch (error) {
      console.error("Rezervasyon detayları alınırken hata:", error);
      Alert.alert("Hata", "Rezervasyon detayları alınırken bir sorun oluştu");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const isDoctor = user?.role === "doctor";
      Alert.alert(
        "Rezervasyonu İptal Et",
        "Bu rezervasyonu iptal etmek istediğinizden emin misiniz?",
        [
          {
            text: "Vazgeç",
            style: "cancel",
          },
          {
            text: "İptal Et",
            style: "destructive",
            onPress: async () => {
              if (appointment) {
                try {
                  await appointmentsApi.cancelAppointment(appointment.id);
                  const updatedAppointment = {
                    ...appointment,
                    status: "cancelled" as const,
                  };
                  dispatch(updateAppointment(updatedAppointment));
                  Alert.alert(
                    "Başarılı",
                    isDoctor
                      ? "Randevu başarıyla iptal edildi"
                      : "Rezervasyonunuz iptal edildi"
                  );
                  router.back();
                } catch (error: any) {
                  console.error("Rezervasyon iptal edilirken hata:", error);
                  Alert.alert(
                    "Hata",
                    error.response?.data?.message ||
                      "Rezervasyon iptal edilirken bir sorun oluştu"
                  );
                }
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Rezervasyon iptal edilirken hata:", error);
      Alert.alert("Hata", "Rezervasyon iptal edilirken bir sorun oluştu");
    }
  };

  const handleAppointmentAction = async (
    action: "confirm" | "reject" | "complete" | "cancel"
  ) => {
    try {
      let message = "";
      let confirmMessage = "";
      switch (action) {
        case "confirm":
          message = "Bu randevuyu onaylamak istediğinizden emin misiniz?";
          confirmMessage = "Randevu onaylandı";
          break;
        case "reject":
          message = "Bu randevuyu reddetmek istediğinizden emin misiniz?";
          confirmMessage = "Randevu reddedildi";
          break;
        case "cancel":
          message = "Bu rezervasyonu iptal etmek istediğinizden emin misiniz?";
          confirmMessage = "Rezervasyon iptal edildi";
          break;
        case "complete":
          message =
            "Bu randevuyu tamamlandı olarak işaretlemek istediğinizden emin misiniz?";
          confirmMessage = "Randevu tamamlandı";
          break;
      }

      Alert.alert("Randevu İşlemi", message, [
        {
          text: "Vazgeç",
          style: "cancel",
        },
        {
          text: "Onayla",
          style: "default",
          onPress: async () => {
            if (appointment) {
              try {
                let response;
                if (action === "cancel") {
                  response = await appointmentsApi.cancelAppointment(
                    appointment.id
                  );
                } else {
                  response = await appointmentsApi.updateAppointmentStatus(
                    appointment.id,
                    action
                  );
                }

                // Redux store'u güncelle
                const updatedAppointment = {
                  ...appointment,
                  status:
                    action === "confirm"
                      ? ("confirmed" as const)
                      : action === "reject" || action === "cancel"
                      ? ("cancelled" as const)
                      : ("completed" as const),
                };

                dispatch(updateAppointment(updatedAppointment));

                Alert.alert("Başarılı", confirmMessage);
                router.back();
              } catch (error: any) {
                console.error(
                  "Randevu işlemi sırasında hata:",
                  error.response.data.message
                );
                Alert.alert("Hata", "İşlem sırasında bir sorun oluştu");
              }
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Randevu işlemi sırasında hata:", error);
      Alert.alert("Hata", "İşlem sırasında bir sorun oluştu");
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      await ratingsApi.createRating({
        appointmentId: appointment?.id as string,
        doctorId: appointment?.doctorId as string,
        rating,
        comment,
      });
      Alert.alert("Uğurlu", "Rəyiniz uğurla göndərildi", [
        {
          text: "OK",
          onPress: () => {
            setShowRatingModal(false);
            fetchAppointment();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Rəy göndərilərkən xəta:", error.response?.data?.message);
      Alert.alert("Xəta", "Rəy göndərilərkən xəta baş verdi");
    }
  };

  const handleAddComment = async () => {
    try {
      if (!appointment) return;

      Alert.prompt(
        "Həkimə şərh yazın",
        "Zəhmət olmasa, həkiminiz haqqında fikirlərinizi bildirin",
        [
          {
            text: "Ləğv et",
            style: "cancel",
          },
          {
            text: "Göndər",
            onPress: async (comment?: string) => {
              if (!comment) {
                Alert.alert("Xəta", "Şərh boş ola bilməz");
                return;
              }

              try {
                await commentsApi.createComment(appointment.id, comment);
                Alert.alert("Uğurlu", "Şərhiniz uğurla göndərildi");
                router.back();
              } catch (error: any) {
                console.error("Şərh göndərilərkən xəta:", error);
                Alert.alert(
                  "Xəta",
                  error.response?.data?.message ||
                    "Şərh göndərilərkən xəta baş verdi"
                );
              }
            },
          },
        ],
        "plain-text",
        "",
        "default"
      );
    } catch (error) {
      console.error("Şərh göndərilərkən xəta:", error);
      Alert.alert("Xəta", "Şərh göndərilərkən xəta baş verdi");
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchAppointment();
    }
  }, [isAuthenticated, id]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (!appointment) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <FontAwesome
          name="calendar-times-o"
          size={50}
          color={Colors[colorScheme ?? "light"].text}
          style={{ marginBottom: 16 }}
        />
        <ThemedText className="text-base text-center">
          Rezervasyon bulunamadı
        </ThemedText>
      </ThemedView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "confirmed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      case "completed":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "confirmed":
        return "Onaylandı";
      case "cancelled":
        return "İptal Edildi";
      case "completed":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  const userInfo =
    user?.role === "patient" ? appointment.doctor : appointment.patient;

  const renderUserInfo = () => {
    if (!userInfo) return null;

    if (user?.role === "patient" && "specialty" in userInfo) {
      return (
        <ThemedText className="text-gray-500">{userInfo.specialty}</ThemedText>
      );
    }

    if (user?.role === "doctor" && "email" in userInfo && "phone" in userInfo) {
      return (
        <>
          <ThemedText className="text-gray-500">{userInfo.email}</ThemedText>
          <ThemedText className="text-gray-500">{userInfo.phone}</ThemedText>
        </>
      );
    }

    return null;
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header showBackButton title="Rezervasyon Detayı" />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            globalStyles.container,
            { paddingTop: 20, paddingBottom: 100 },
          ]}
        >
          {/* Kullanıcı Bilgileri */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                {userInfo?.image ? (
                  <Image
                    source={{ uri: `${SITE_URL}${userInfo.image}` }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <FontAwesome name="user" size={24} color="#6b7280" />
                  </View>
                )}
              </View>
              <View>
                <ThemedText className="text-lg font-bold">
                  {userInfo?.name}
                </ThemedText>
                {renderUserInfo()}
              </View>
            </View>
          </View>

          {/* Rezervasyon Detayları */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <ThemedText className="text-lg font-bold mb-4">
              Rezervasyon Bilgileri
            </ThemedText>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <ThemedText className="text-gray-500">Tarix</ThemedText>
                <ThemedText>
                  {format(new Date(appointment.date), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </ThemedText>
              </View>

              <View className="flex-row justify-between items-center">
                <ThemedText className="text-gray-500">Saat</ThemedText>
                <ThemedText>{appointment.time}</ThemedText>
              </View>

              <View className="flex-row justify-between items-center">
                <ThemedText className="text-gray-500">Durum</ThemedText>
                <ThemedText className={getStatusColor(appointment.status)}>
                  {getStatusText(appointment.status)}
                </ThemedText>
              </View>

              <View className="flex-row justify-between items-center">
                <ThemedText className="text-gray-500">
                  Oluşturulma Tarihi
                </ThemedText>
                <ThemedText>
                  {format(
                    new Date(appointment.createdAt),
                    "d MMMM yyyy HH:mm",
                    {
                      locale: tr,
                    }
                  )}
                </ThemedText>
              </View>

              {appointment.reason && (
                <View className="pt-3 border-t border-gray-100">
                  <ThemedText className="text-gray-500 mb-2">
                    Görüş səbəbi
                  </ThemedText>
                  <ThemedText>{appointment.reason}</ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Aksiyon Butonları */}
          {user?.role === "doctor" && (
            <View className="flex flex-col gap-y-3">
              {appointment.status === "pending" && (
                <>
                  <TouchableOpacity
                    className="bg-green-500 rounded-xl p-4"
                    onPress={() => handleAppointmentAction("confirm")}
                  >
                    <ThemedText className="!text-white text-center font-bold">
                      Randevuyu Onayla
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 rounded-xl p-4"
                    onPress={() => handleAppointmentAction("reject")}
                  >
                    <ThemedText className="!text-white text-center font-bold">
                      Randevuyu Reddet
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}
              {appointment.status === "confirmed" && (
                <TouchableOpacity
                  className="bg-blue-500 rounded-xl p-4"
                  onPress={() => handleAppointmentAction("complete")}
                >
                  <ThemedText className="!text-white text-center font-bold">
                    Randevuyu Tamamla
                  </ThemedText>
                </TouchableOpacity>
              )}
              {(appointment.status === "pending" ||
                appointment.status === "confirmed") && (
                <TouchableOpacity
                  className="bg-red-500 rounded-xl p-4"
                  onPress={() => handleCancelAppointment()}
                >
                  <ThemedText className="!text-white text-center font-bold">
                    Randevuyu İptal Et
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Hasta için İptal Butonu */}
          {user?.role === "patient" && appointment.status === "pending" && (
            <TouchableOpacity
              className="bg-red-500 rounded-xl p-4 mb-4"
              onPress={() => handleCancelAppointment()}
            >
              <ThemedText className="text-white text-center font-bold">
                Rezervasyonu İptal Et
              </ThemedText>
            </TouchableOpacity>
          )}

          {appointment.status === "completed" &&
            user?.role === "patient" &&
            !appointment.hasRating && (
              <TouchableOpacity
                onPress={() => setShowRatingModal(true)}
                className="bg-blue-500 px-4 py-3 rounded-xl mt-4"
              >
                <ThemedText className="!text-white text-center font-semibold">
                  Rəy bildir
                </ThemedText>
              </TouchableOpacity>
            )}

          <RatingModal
            visible={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRatingSubmit}
            appointmentDetails={{
              doctorName: appointment?.doctor?.name || "",
              date: format(new Date(appointment?.date || ""), "d MMMM yyyy", {
                locale: tr,
              }),
              time: appointment?.time || "",
            }}
          />

          {appointment?.status === "completed" &&
            !appointment.hasComment &&
            user?.role === "patient" && (
              <TouchableOpacity
                onPress={handleAddComment}
                className="bg-blue-500 p-3 rounded-lg mb-4 mt-3"
              >
                <Text className="text-white text-center font-semibold">
                  Həkimə şərh yazın
                </Text>
              </TouchableOpacity>
            )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
