import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface EventFAQProps {
  items: FAQItem[];
}

export function EventFAQ({ items }: EventFAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HelpCircle size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Frequently Asked Questions</Text>
      </View>

      <View style={styles.faqList}>
        {items.map((item, index) => {
          const isExpanded = expandedId === item.id;
          const isLast = index === items.length - 1;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.faqItem, !isLast && styles.faqItemBorder]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question}</Text>
                {isExpanded ? (
                  <ChevronUp size={20} color={theme.colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={theme.colors.textSecondary} />
                )}
              </View>

              {isExpanded && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  faqList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  faqItem: {
    padding: theme.spacing.md,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  answer: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
