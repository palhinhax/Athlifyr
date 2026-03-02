// ============================================================================
// Athlifyr Live Server — LiveRace Module Barrel Export
// ============================================================================

export { liveRaceRoutes, setLiveRaceIO } from "./liverace.routes.js";
export {
  registerLiveRaceHandlers,
  handleLiveRaceDisconnect,
} from "./liverace.handlers.js";
export {
  startEvent,
  stopEvent,
  getRoom,
  getSnapshot,
  hasRoom,
  eventRoom,
} from "./liverace.service.js";

// Re-export types
export type {
  EventLiveStatus,
  AthleteState,
  LeaderboardEntry,
  AthletePositionUpdate,
  GPSPoint,
  LiveConfig,
} from "./liverace.types.js";
