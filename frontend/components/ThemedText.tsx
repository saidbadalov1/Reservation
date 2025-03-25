import { Text, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@react-navigation/native";

type FontWeight = "regular" | "medium" | "bold" | "heavy";
type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface ThemedTextProps extends TextProps {
  weight?: FontWeight;
  size?: TextSize;
  className?: string;
  color?: string;
  center?: boolean;
}

const fontSizes = {
  xs: "text-xs", // 12px
  sm: "text-sm", // 14px
  base: "text-base", // 16px
  lg: "text-lg", // 18px
  xl: "text-xl", // 20px
  "2xl": "text-2xl", // 24px
  "3xl": "text-3xl", // 30px
  "4xl": "text-4xl", // 36px
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  weight = "regular",
  size = "base",
  className,
  color,
  center,
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Text
      className={twMerge(fontSizes[size], center && "text-center", className)}
      style={[
        {
          fontFamily: theme.fonts[weight].fontFamily,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
