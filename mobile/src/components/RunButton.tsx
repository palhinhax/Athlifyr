import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { colors, spacing } from "@/src/constants/theme";

export function RunButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/free-run")}
      style={styles.container}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Play size={22} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    position: "relative",
  },
});
