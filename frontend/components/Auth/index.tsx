import { useState } from "react";
import { ThemedView } from "../ThemedView";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Login from "./Login";
import Register from "./Register";

function Auth() {
  const [screen, setScreen] = useState<"login" | "register">("login");

  const isLogin = screen === "login";

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 100,
          }}
          keyboardShouldPersistTaps="handled"
          className="flex-1  px-6"
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-center mb-2">
              {isLogin ? "Xoş Gəldiniz" : "Hesab Yarat"}
            </Text>
            <Text className="text-gray-500 text-center">
              {isLogin ? "Hesabınıza daxil olun" : "Yeni bir hesab yaradın"}
            </Text>
          </View>

          {/* Form Container */}
          <View className="relative">
            <Animated.View className="w-full">
              {isLogin ? <Login /> : <Register />}
            </Animated.View>
          </View>

          {/* Switch Button */}
          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-gray-500 mr-2">
              {isLogin ? "Hesabınız yoxdur?" : "Hesabınız var mı?"}
            </Text>
            <TouchableOpacity
              onPress={() => setScreen(isLogin ? "register" : "login")}
              className="bg-blue-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">
                {isLogin ? "Qeydiyyat" : "Daxil ol"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

export default Auth;
