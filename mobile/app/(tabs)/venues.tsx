import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/src/constants/theme";

export default function VenuesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Venues - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: 18,
    color: theme.colors.text,
  },
});
