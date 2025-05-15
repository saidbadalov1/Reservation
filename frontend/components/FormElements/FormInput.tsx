import React, { ReactNode } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { ThemedText } from "../ThemedText";

interface FormInputProps extends TextInputProps {
  error?: string;
  touched?: boolean;
  fullWidth?: boolean;
  withLabel?: string;
  leftIcon?: ReactNode;
}

export const FormInput = ({
  error,
  touched,
  fullWidth,
  withLabel,
  leftIcon,
  ...props
}: FormInputProps) => {
  return (
    <View className={`${fullWidth ? "flex-1" : ""} flex flex-col gap-y-2`}>
      {withLabel && (
        <ThemedText weight="medium" className="text-gray-900 ml-1">
          {withLabel}
        </ThemedText>
      )}
      <View className="relative flex-row items-center">
        {leftIcon && <View className="absolute left-4 z-10">{leftIcon}</View>}
        <TextInput
          className={`flex-1 bg-gray-50 px-4 py-3.5 rounded-xl text-gray-900 ${
            leftIcon ? "pl-12" : "pl-4"
          } ${
            error && touched
              ? "border border-red-500"
              : "border border-gray-100"
          }`}
          placeholderTextColor="#6b7280"
          {...props}
        />
      </View>
      {error && touched && (
        <ThemedText className="mt-1 !text-red-500 text-sm ml-1">
          {error}
        </ThemedText>
      )}
    </View>
  );
};
