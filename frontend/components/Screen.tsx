import React, { ReactNode } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";

interface ScreenProps {
  children: ReactNode;
  style?: object;
}

export const Screen = ({ children, style }: ScreenProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, style]}
    >
      <View style={styles.content}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
