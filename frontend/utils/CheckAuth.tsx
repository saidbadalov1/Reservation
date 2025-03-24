import { login } from "@/store/slices/authSlice";
import { storage } from "@/services/storage.services";
import { authApi } from "@/services/login.services";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const CheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getToken();

        if (token) {
          const response = await authApi.getMe(token);

          dispatch(
            login({
              user: response.user,
              token,
            })
          );
        }
      } catch (error) {
        console.error("Auth yoxlama xətası:", error);
        // Hata durumunda token'ı temizle
        await storage.clearAuth();
      }
    };

    checkAuth();
  }, []);

  return <></>;
};
export default CheckAuth;
