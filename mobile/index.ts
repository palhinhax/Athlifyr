// Initialize Sentry BEFORE anything else to capture early errors.
import { initSentry } from "./src/lib/sentry";
initSentry();

// Register background location task BEFORE the app loads.
// TaskManager.defineTask must be called at the top-level module scope.
import "./src/lib/background-location";

import "expo-router/entry";
