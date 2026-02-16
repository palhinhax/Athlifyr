import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

export function SearchButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/search");
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Search size={22} color={theme.colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 4,
  },
});
