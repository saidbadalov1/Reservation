import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@auth_token";
const USER_DATA_KEY = "@user_data";
const HAS_SEEN_ONBOARDING_KEY = "@has_seen_onboarding";

export const storage = {
  // Token işlemleri
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      // Token saklama hatası
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      // Token okuma hatası
      return null;
    }
  },

  // Kullanıcı bilgileri işlemleri
  setUser: async (user: any) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      // Kullanıcı bilgilerini saklama hatası
    }
  },

  getUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      // Kullanıcı bilgilerini okuma hatası
      return null;
    }
  },

  // Tüm auth verilerini temizle
  clearAuth: async () => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      // Auth temizleme hatası
    }
  },

  // Onboarding işlemleri
  hasSeenOnboarding: async () => {
    try {
      const hasSeen = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY);
      return hasSeen === "true";
    } catch (error) {
      return false;
    }
  },

  setHasSeenOnboarding: async () => {
    try {
      await AsyncStorage.setItem(HAS_SEEN_ONBOARDING_KEY, "true");
    } catch (error) {
      // Onboarding durumu saklama hatası
    }
  },

  clearOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(HAS_SEEN_ONBOARDING_KEY);
    } catch (error) {
      // Onboarding temizleme hatası
    }
  },
};
