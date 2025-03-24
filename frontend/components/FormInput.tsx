import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface FormInputProps extends TextInputProps {
  error?: string;
  touched?: boolean;
}

export const FormInput = ({ error, touched, ...props }: FormInputProps) => {
  return (
    <View>
      <TextInput
        className={`bg-gray-100 px-4 py-3 rounded-xl text-gray-900 ${
          error && touched ? "border border-red-500" : ""
        }`}
        placeholderTextColor="#6b7280"
        {...props}
      />
      {error && touched && (
        <ThemedText className="mt-1 !text-red-500 text-sm">{error}</ThemedText>
      )}
    </View>
  );
};
