import { View, Text, TouchableOpacity } from "react-native";
import { ShieldCheck, ChevronDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { GiveawayData } from "./giveawayTypes";
import { styles } from "./giveawayCardStyles";

interface TransparencySectionProps {
  readonly giveaway: GiveawayData;
  readonly isDrawn: boolean;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

export function TransparencySection({
  giveaway,
  isDrawn,
  isOpen,
  onToggle,
}: TransparencySectionProps) {
  const { t } = useTranslation();

  return (
    <View>
      <TouchableOpacity
        style={styles.transparencyTrigger}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <ShieldCheck size={14} color="#0d9488" />
        <Text style={styles.transparencyTriggerText}>
          {t("events.giveaway.transparency.transparency")}
        </Text>
        <View style={styles.transparencyChevron}>
          <ChevronDown
            size={14}
            color={theme.colors.mutedForeground}
            style={isOpen ? { transform: [{ rotate: "180deg" }] } : undefined}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.transparencyContent}>
          {/* Step-by-step explanation */}
          <View style={styles.stepsBox}>
            <View style={styles.stepsHeader}>
              <ShieldCheck size={14} color="#0d9488" />
              <Text style={styles.stepsTitle}>
                {t("events.giveaway.transparency.howItWorks")}
              </Text>
            </View>
            <View style={styles.stepsBody}>
              <Text style={styles.stepText}>
                {t("events.giveaway.transparency.step1")}
              </Text>
              <Text style={styles.stepText}>
                {t("events.giveaway.transparency.step2")}
              </Text>
              <Text style={styles.stepText}>
                {t("events.giveaway.transparency.step3")}
              </Text>
            </View>
          </View>

          {/* Formula explanation */}
          <View style={styles.formulaBox}>
            <Text style={styles.formulaTitle}>
              {t("events.giveaway.transparency.formulaTitle")}
            </Text>
            <View style={styles.formulaCode}>
              <Text style={styles.formulaCodeText}>
                SHA-256(&quot;secret | rank | attempt&quot;) % N + 1 = winner
              </Text>
            </View>
            <Text style={styles.formulaExplanation}>
              {t("events.giveaway.transparency.formulaExplanation")}
            </Text>
          </View>

          {/* Commit hash */}
          {giveaway.secretHash && (
            <View style={styles.hashBox}>
              <Text style={styles.hashTitle}>
                {t("events.giveaway.transparency.secretHash")}
              </Text>
              <Text style={styles.hashExplanation}>
                {t("events.giveaway.transparency.secretHashExplanation")}
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeBlockText} selectable>
                  {giveaway.secretHash}
                </Text>
              </View>
            </View>
          )}

          {/* Post-draw: final count */}
          {isDrawn && giveaway.finalParticipantsCount !== null && (
            <Text style={styles.finalCount}>
              {t("events.giveaway.transparency.finalParticipantsCount", {
                count: giveaway.finalParticipantsCount,
              })}
            </Text>
          )}

          {/* Post-draw: winning tickets */}
          {isDrawn && giveaway.winningTicketNumbers.length > 0 && (
            <View style={styles.winningTicketsBox}>
              <Text style={styles.winningTicketsTitle}>
                {t("events.giveaway.transparency.winningTickets")}
              </Text>
              <Text style={styles.winningTicketsNumbers}>
                {giveaway.winningTicketNumbers.map((n) => `#${n}`).join(", ")}
              </Text>
            </View>
          )}

          {/* Post-draw: revealed secret + verification */}
          {isDrawn && giveaway.secretRevealed && (
            <View style={styles.hashBox}>
              <Text style={styles.hashTitle}>
                {t("events.giveaway.transparency.secretRevealed")}
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeBlockText} selectable>
                  {giveaway.secretRevealed}
                </Text>
              </View>
              {giveaway.finalParticipantsCount !== null &&
                giveaway.winningTicketNumbers.length > 0 && (
                  <View style={styles.verifyBox}>
                    <Text style={styles.verifyTitle}>
                      {t("events.giveaway.transparency.verifyTitle")}
                    </Text>
                    {giveaway.winningTicketNumbers.map((ticket, i) => (
                      <Text
                        key={ticket}
                        style={styles.verifyFormula}
                        selectable
                      >
                        {t("events.giveaway.transparency.verifyFormula", {
                          secret: giveaway.secretRevealed!,
                          rank: i + 1,
                          attempt: giveaway.winningTicketAttempts?.[i] ?? 0,
                          total: giveaway.finalParticipantsCount!,
                          winning: ticket,
                        })}
                      </Text>
                    ))}
                  </View>
                )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
