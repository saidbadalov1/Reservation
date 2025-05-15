import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { storage } from "@/services/storage.services";
import OnboardingSlider from "./OnboardingSlider";

const OnboardingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const hasSeen = await storage.hasSeenOnboarding();
    setShowOnboarding(!hasSeen);
  };

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingSlider onFinish={handleFinishOnboarding} />;
  }

  return <>{children}</>;
};

export default OnboardingWrapper;
