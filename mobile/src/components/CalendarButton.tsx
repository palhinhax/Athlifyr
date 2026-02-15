import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CalendarClock } from "lucide-react-native";
import { colors, spacing } from "@/src/constants/theme";

export function CalendarButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/my-schedule");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <CalendarClock size={22} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.sm,
    position: "relative",
  },
});
