import React from "react";
import { ThemedView } from "../ThemedView";
import { ScrollView } from "react-native";
import HomeHeader from "./HomeHeader";
import HomeInfoCards from "./HomeInfoCards";
import HomeSpecialties from "./HomeSpecialties";

const Home = () => {
  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" bounces={false}>
        <HomeHeader />
        <HomeInfoCards />
        <HomeSpecialties />
      </ScrollView>
    </ThemedView>
  );
};

export default Home;
