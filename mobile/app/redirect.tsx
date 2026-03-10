// ============================================================================
// Athlifyr Mobile — Redirect Handler (Expo Go)
//
// Handles the deep-link callback from Google OAuth when running in Expo Go.
// The Expo Go redirect URI uses the path "redirect" (athlifyr://redirect).
// See oauth2redirect.tsx for the production/dev-build equivalent.
// ============================================================================

import { View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { theme } from "@/src/constants/theme";

WebBrowser.maybeCompleteAuthSession();

export default function RedirectScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
