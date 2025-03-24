import Auth from "@/components/Auth";
import Profile from "@/components/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProfileScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <Profile /> : <Auth />;
}
