import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/src/constants/theme";

export function HeaderLogo() {
  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={<Text style={styles.text}>Athlifyr</Text>}
        style={styles.maskedView}
      >
        <LinearGradient
          colors={[theme.colors.accent, `${theme.colors.accent}B3`]} // accent to accent/70
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
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    width: 140,
  },
  maskedView: {
    height: 32,
  },
  text: {
    fontSize: 24,
    fontWeight: "700", // bold
    letterSpacing: -0.5,
    color: "black", // Required for MaskedView mask
  },
  gradient: {
    flex: 1,
    height: 32,
    width: 140,
  },
});
