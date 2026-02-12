import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";

// Check if running in Expo Go (native Google Sign-In won't work there)
const isExpoGo = Constants.appOwnership === "expo";

// Lazy-load the Google Sign-In module to avoid crashing in Expo Go
// The native module registers at import time and throws in Expo Go
let googleSignInModule:
  | typeof import("@react-native-google-signin/google-signin")
  | null = null;
let configured = false;

async function getGoogleSignIn() {
  if (!googleSignInModule) {
    googleSignInModule =
      await import("@react-native-google-signin/google-signin");
  }
  if (!configured) {
    googleSignInModule.GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
    configured = true;
  }
  return googleSignInModule;
}

export function useGoogleAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const isReady = !isExpoGo;

  useEffect(() => {
    if (isExpoGo) {
      console.log(
        "Google Sign-In nativo não disponível no Expo Go. Usa um build standalone."
      );
    }
  }, []);

  const signIn = async () => {
    if (isExpoGo) {
      throw new Error("Google Sign-In requires a standalone build");
    }

    try {
      const gsi = await getGoogleSignIn();
      await gsi.GoogleSignin.hasPlayServices();
      const response = await gsi.GoogleSignin.signIn();

      if (gsi.isSuccessResponse(response)) {
        const { idToken } = response.data;

        console.log(
          "Google Sign-In Success! idToken:",
          idToken?.substring(0, 20) + "..."
        );

        if (idToken) {
          await handleGoogleToken(idToken);
        }
      }
    } catch (error: unknown) {
      const gsi = await getGoogleSignIn();
      if (gsi.isErrorWithCode(error)) {
        switch (error.code) {
          case gsi.statusCodes.IN_PROGRESS:
            console.log("Google Sign-In already in progress");
            break;
          case gsi.statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error("Play Services not available");
            throw new Error("Google Play Services not available");
          default:
            console.error("Google Sign-In error:", error.code, error.message);
            throw error;
        }
      } else {
        console.error("Google Sign-In unknown error:", error);
        throw error;
      }
    }
  };

  const handleGoogleToken = async (idToken: string) => {
    try {
      // Send the Google ID token to your backend
      const res = await api.post("/auth/google-mobile", {
        idToken,
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
      console.error("Google auth backend error:", error);
      throw error;
    }
  };

  return {
    signIn,
    isReady,
  };
}
