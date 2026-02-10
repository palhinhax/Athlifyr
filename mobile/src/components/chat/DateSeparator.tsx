import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { theme } from "@/src/constants/theme";

interface DateSeparatorProps {
  date: Date | string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  const dateObj = new Date(date);
  
  const getDateLabel = () => {
    if (isToday(dateObj)) {
      return "Today";
    } else if (isYesterday(dateObj)) {
      return "Yesterday";
    } else if (differenceInDays(new Date(), dateObj) < 7) {
      return format(dateObj, "EEEE"); // Day name
    } else {
      return format(dateObj, "MMM dd, yyyy");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{getDateLabel()}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  text: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    paddingHorizontal: 12,
    fontWeight: "500",
  },
});
