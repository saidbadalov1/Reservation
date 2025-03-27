import React from "react";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";

export const getSpecialtyIcon = (
  name: string,
  iconSize = 20,
  iconColor = "#6b7280"
) => {
  switch (name) {
    case "Kardioloq":
      return (
        <FontAwesome5 name="heartbeat" size={iconSize} color={iconColor} />
      );
    case "Nevroloq":
      return <FontAwesome5 name="brain" size={iconSize} color={iconColor} />;
    case "Psixiatr":
    case "Psixoterapevt":
    case "Uşaq psixiatrı":
      return <FontAwesome5 name="user-md" size={iconSize} color={iconColor} />;
    case "Pulmonoloq":
      return <FontAwesome5 name="lungs" size={iconSize} color={iconColor} />;
    case "Endokrinoloq":
      return (
        <MaterialCommunityIcons
          name="needle"
          size={iconSize}
          color={iconColor}
        />
      );
    case "Ginekoloq":
    case "Mamaginikoloq":
      return <Fontisto name="female" size={iconSize} color={iconColor} />;
    case "Uroloq":
      return <Fontisto name="male" size={iconSize} color={iconColor} />;
    case "Dermatoloq":
      return (
        <MaterialCommunityIcons
          name="hand-heart"
          size={iconSize}
          color={iconColor}
        />
      );
    case "Onkoloq":
      return <FontAwesome5 name="ribbon" size={iconSize} color={iconColor} />;
    case "Stomatoloq":
      return (
        <MaterialCommunityIcons
          name="tooth"
          size={iconSize}
          color={iconColor}
        />
      );
    case "Pediatr":
      return <FontAwesome5 name="baby" size={iconSize} color={iconColor} />;
    case "Ortoped":
    case "Travmatoloq":
      return <FontAwesome5 name="bone" size={iconSize} color={iconColor} />;
    case "Oftalmoloq":
      return <FontAwesome5 name="eye" size={iconSize} color={iconColor} />;
    case "Otorinolarinqoloq (LOR)":
      return <FontAwesome5 name="ear" size={iconSize} color={iconColor} />;
    case "Cərrah":
    case "Plastik cərrah":
    case "Ürək-damar cərrahı":
    case "Neurocərrah":
      return <FontAwesome5 name="cut" size={iconSize} color={iconColor} />;
    default:
      return <FontAwesome5 name="user-md" size={iconSize} color={iconColor} />;
  }
};
