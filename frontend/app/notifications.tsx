import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Auth from "@/components/Auth";
import { storage } from "@/services/storage.services";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { twMerge } from "tailwind-merge";
import { globalStyles } from "@/utils/globalStyles";
import api from "@/services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;

  appointmentId?: string;
}

export default function NotificationsScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/notifications`);

      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Bildirimler alınırken hata oluştu:", error);
      Alert.alert("Hata", "Bildirimler alınırken bir sorun oluştu");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = await storage.getToken();

      if (!token) return;

      await api.patch(`/notifications/${notificationId}/read`);

      // Bildirimi okundu olarak işaretle (UI'ı güncelle)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Bildirim okundu olarak işaretlenirken hata:", error);
    }
  };

  // const markAllAsRead = async () => {
  //   try {
  //     const token = await storage.getToken();

  //     if (!token) return;

  //     await axios.patch(
  //       `${API_URL}/notifications/read-all`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Tüm bildirimleri okundu olarak işaretle (UI'ı güncelle)
  //     setNotifications((prev) =>
  //       prev.map((notif) => ({ ...notif, isRead: true }))
  //     );

  //     Alert.alert("Başarılı", "Tüm bildirimler okundu olarak işaretlendi");
  //   } catch (error) {
  //     console.error(
  //       "Tüm bildirimler okundu olarak işaretlenirken hata:",
  //       error
  //     );
  //     Alert.alert("Hata", "İşlem sırasında bir sorun oluştu");
  //   }
  // };

  const handleNotificationPress = (notification: Notification) => {
    // Bildirimi okundu olarak işaretle
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Bildirim tipine göre yönlendirme yap
    if (notification.type === "appointment" && notification.appointmentId) {
      router.push(`/reservations/${notification?.appointmentId}`);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const notificationDate = new Date(item.createdAt);
    const formattedDate = `${notificationDate.toLocaleDateString(
      "az-AZ"
    )} ${notificationDate.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return (
      <TouchableOpacity
        className={twMerge(
          "rounded-xl mb-3 p-4 border border-gray-200",
          !item.isRead ? "bg-blue-50/20" : ""
        )}
        onPress={() => handleNotificationPress(item)}
      >
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-2">
            <ThemedText className="text-base font-bold">
              {item.title}
            </ThemedText>
            {!item.isRead && (
              <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
          </View>
          <ThemedText className="text-sm mb-2">{item.message}</ThemedText>
          <ThemedText className="text-xs text-gray-500 text-right">
            {formattedDate}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header showBackButton title="Bildirimlerim" />

        <View style={globalStyles.container} className="py-4 flex-1">
          {notifications.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <FontAwesome
                name="bell-o"
                size={50}
                color={Colors[colorScheme ?? "light"].text}
                style={{ marginBottom: 16 }}
              />
              <ThemedText className="text-base text-center">
                Hiç bildiriminiz yok
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.tint]}
                  tintColor={Colors[colorScheme ?? "light"].text}
                />
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
