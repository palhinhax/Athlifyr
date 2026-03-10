// ============================================================================
// Athlifyr Mobile — OAuth2 Redirect Handler
//
// Handles the deep-link callback from Google OAuth.
// The `maybeCompleteAuthSession()` call at module scope intercepts the
// authorization response so that `useAuthRequest` in useGoogleAuth can
// process the code exchange.  The user should never see this screen — it
// exists only so expo-router has a valid route for the redirect URI.
// ============================================================================

import { View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { theme } from "@/src/constants/theme";

WebBrowser.maybeCompleteAuthSession();

export default function OAuth2RedirectScreen() {
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
