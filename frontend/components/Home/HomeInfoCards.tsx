import React from "react";
import { View, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { globalStyles } from "@/utils/globalStyles";

const WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (WIDTH - 48) / 2;

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
  iconBorderColor: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  bgColor,
  iconBgColor,
  iconBorderColor,
}) => {
  return (
    <View
      className={`rounded-xl`}
      style={{
        backgroundColor: bgColor,
        width: CARD_WIDTH,
        height: 150,
        padding: 12,
        gap: 12,
      }}
    >
      <View
        className="w-10 h-10 items-center justify-center rounded-lg"
        style={{
          backgroundColor: iconBgColor,
          borderWidth: 1,
          borderColor: iconBorderColor,
        }}
      >
        {icon}
      </View>
      <View>
        <ThemedText
          weight="bold"
          size="lg"
          className="text-black font-bold leading-6"
        >
          {title}
        </ThemedText>
        <ThemedText weight="medium" size="sm" className="text-gray-500 mt-1">
          {description}
        </ThemedText>
      </View>
    </View>
  );
};

const HomeInfoCards = () => {
  const router = useRouter();

  const cards = [
    {
      icon: (
        <Ionicons name="chevron-down-circle-sharp" size={20} color="#254EDB" />
      ),
      title: "Həkimi seç",
      description: "Həkim və ya mütəxəssis tap",
      bgColor: "#F9F5FF",
      iconBgColor: "#C6D4F1",
      iconBorderColor: "#A0B6EA",
      onPress: () => router.push("/"),
    },
    {
      icon: <Ionicons name="chatbubbles-outline" size={20} color="#16B364" />,
      title: "Rezervasiya sorğusu göndər",
      description: "Mütəxəssisin cavabını gözlə",
      bgColor: "#EDFCF2",
      iconBgColor: "#D3F8DF",
      iconBorderColor: "#AAF0C4",
      onPress: () => router.push("/"),
    },
    {
      icon: <Ionicons name="walk-outline" size={20} color="#EF6820" />,
      title: "Həkim qəbulu",
      description: "Həkim qəbuluna get",
      bgColor: "#FEF6EE",
      iconBgColor: "#FEE4E2",
      iconBorderColor: "#F9DBAF",
      onPress: () => router.push("/"),
    },
    {
      icon: <Ionicons name="receipt-outline" size={20} color="#F04438" />,
      title: "Online resept",
      description: "Əl yazısından qurtul, reseptini telefondan götür",
      bgColor: "#FEF3F2",
      iconBgColor: "#FEE4E2",
      iconBorderColor: "#FECDCA",
      onPress: () => router.push("/"),
    },
  ];

  return (
    <View
      style={globalStyles.container}
      className="flex-row flex-wrap justify-between items-center py-6 gap-y-4"
    >
      {cards.map((card, index) => (
        <InfoCard key={index} {...card} />
      ))}
    </View>
  );
};

export default HomeInfoCards;
