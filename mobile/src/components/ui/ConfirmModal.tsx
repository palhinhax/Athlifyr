import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

// ── Types ──────────────────────────────────────────────────────────────

export interface ConfirmModalAction {
  /** Button label */
  label: string;
  /** Visual style of the button */
  variant?: "primary" | "destructive" | "outline";
  /** Callback when pressed */
  onPress: () => void;
  /** Show a loading spinner instead of label */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
}

interface ConfirmModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Called when the modal should close (backdrop tap, X button) */
  onClose: () => void;
  /** Title displayed at the top */
  title: string;
  /** Optional message body */
  message?: string;
  /** Optional icon element displayed above the title */
  icon?: React.ReactNode;
  /** Action buttons rendered at the bottom */
  actions?: ConfirmModalAction[];
}

// ── Component ──────────────────────────────────────────────────────────

export function ConfirmModal({
  visible,
  onClose,
  title,
  message,
  icon,
  actions = [],
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Card — stop propagation so tapping card doesn't close */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <X size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          {/* Icon */}
          {icon && <View style={styles.iconContainer}>{icon}</View>}

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Actions */}
          {actions.length > 0 && (
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => {
                const variant = action.variant ?? "outline";
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      variant === "primary" && styles.buttonPrimary,
                      variant === "destructive" && styles.buttonDestructive,
                      variant === "outline" && styles.buttonOutline,
                      action.disabled && styles.buttonDisabled,
                    ]}
                    onPress={action.onPress}
                    disabled={action.disabled || action.loading}
                    activeOpacity={0.7}
                  >
                    {action.loading ? (
                      <ActivityIndicator
                        size="small"
                        color={
                          variant === "outline"
                            ? theme.colors.text
                            : theme.colors.white
                        }
                      />
                    ) : (
                      <Text
                        style={[
                          styles.buttonText,
                          variant === "primary" && styles.buttonTextPrimary,
                          variant === "destructive" &&
                            styles.buttonTextDestructive,
                          variant === "outline" && styles.buttonTextOutline,
                        ]}
                      >
                        {action.label}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    ...theme.shadows.xl,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },
  actionsContainer: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonDestructive: {
    backgroundColor: theme.colors.error,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  buttonTextPrimary: {
    color: theme.colors.white,
  },
  buttonTextDestructive: {
    color: theme.colors.white,
  },
  buttonTextOutline: {
    color: theme.colors.text,
  },
});
