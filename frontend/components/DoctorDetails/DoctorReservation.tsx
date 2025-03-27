import React from "react";
import { DoctorDetailProps } from "./types";
import { router } from "expo-router";
import BottomButton from "../ui/BottomButton";

const DoctorReservation: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const handleMakeAppointment = () => {
    router.push(`/doctor/${doctor.id}/reservation`);
  };

  return <BottomButton title="Randevu al" onPress={handleMakeAppointment} />;
};

export default DoctorReservation;
