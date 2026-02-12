import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

// Required for Expo Go auth session redirect
WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";

export function useGoogleAuth() {
  const setUser = useAuthStore((s) => s.setUser);

  // Use makeRedirectUri to automatically generate the correct redirect URI
  // This works with both Expo Go and standalone builds
  const redirectUri = "athlifyr://";

  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  // Debug
  console.log("Google Auth Config:", {
    redirectUri,
    androidClientId,
    iosClientId,
    webClientId,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId,
    redirectUri,
  });

  const handleGoogleToken = async (accessToken: string) => {
    try {
      // Send the Google access token to your backend
      // The backend will verify it with Google and create/find the user
      const res = await api.post("/auth/google-mobile", {
        accessToken,
      });

      const { token, refreshToken, user } = res.data;

      // Store tokens
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Update auth state
      setUser(user);
      useAuthStore.setState({
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("Google Auth Response:", response);

    if (response?.type === "success") {
      const { authentication } = response;
      console.log(
        "Google Auth Success! Access Token:",
        authentication?.accessToken?.substring(0, 20) + "..."
      );

      if (authentication?.accessToken) {
        handleGoogleToken(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      console.error("Google Auth Error:", response.error);
    } else if (response?.type === "cancel") {
      console.log("Google Auth Cancelled");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    promptAsync,
    isReady: !!request,
  };
}
