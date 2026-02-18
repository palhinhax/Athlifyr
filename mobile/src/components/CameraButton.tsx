import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { colors, spacing } from "@/src/constants/theme";

export function CameraButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/camera")}
      style={styles.container}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Camera size={22} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    position: "relative",
  },
});
