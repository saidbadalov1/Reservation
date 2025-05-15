import React, { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Auth from "@/components/Auth";
import { ActivityIndicator, View } from "react-native";
import { storage } from "@/services/storage.services";
import { authApi } from "@/services/login.services";
import { login } from "@/store/slices/authSlice";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check token and restore auth state on mount
  useEffect(() => {
    const checkAuthAndRestore = async () => {
      try {
        const token = await storage.getToken();

        if (token && !isAuthenticated) {
          // If we have a token but not authenticated, try to restore session
          const response = await authApi.getMe(token);
          dispatch(
            login({
              user: response.user,
              token,
            })
          );
        }
      } catch (error) {
        // If token is invalid, clear it
        await storage.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRestore();
  }, []); // Only run on mount

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
