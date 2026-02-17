import { Stack } from "expo-router";

/**
 * Layout for the lift-analysis screen group.
 * All screens in this group use stack navigation with hidden headers
 * (each screen manages its own header).
 */
export default function LiftAnalysisLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="history" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="editor" />
      <Stack.Screen name="analysis" />
    </Stack>
  );
}
