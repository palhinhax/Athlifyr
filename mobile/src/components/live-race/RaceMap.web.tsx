import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/src/constants/theme";

/**
 * Web stub for RaceMap — react-native-maps is not supported on web.
 */
export function RaceMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map is only available on mobile devices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
  },
  text: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
});
