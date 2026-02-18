/**
 * WatermarkLogo — "Athlifyr" watermark overlay for analysis video views.
 * Mirrors the HeaderLogo gradient style, positioned bottom-right.
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/src/constants/theme";

interface WatermarkLogoProps {
  /** Override opacity (default 0.75) */
  opacity?: number;
}

export function WatermarkLogo({ opacity = 0.75 }: WatermarkLogoProps) {
  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      <MaskedView
        maskElement={<Text style={styles.text}>Athlifyr</Text>}
        style={styles.maskedView}
      >
        <LinearGradient
          colors={[theme.colors.accent, `${theme.colors.accent}B3`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 20,
  },
  maskedView: {
    height: 22,
    width: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "black", // required for MaskedView mask
  },
  gradient: {
    flex: 1,
    height: 22,
    width: 100,
  },
});
