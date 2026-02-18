/** Normalized 2D point (0..1) with timestamp */
export interface BarPathPoint {
  /** Timestamp in milliseconds from video start */
  t: number;
  /** Normalized X coordinate (0 = left, 1 = right) */
  x: number;
  /** Normalized Y coordinate (0 = top, 1 = bottom) */
  y: number;
}

/** Computed metrics for a lift analysis */
export interface LiftMetrics {
  /** Maximum horizontal drift from start position (normalized) */
  maxHorizontalDrift: number;
  /** Total vertical travel (normalized) */
  totalVerticalTravel: number;
  /** Duration of the tracked segment in ms */
  durationMs: number;
  /** Average bar speed (normalized units per second) */
  averageSpeed: number;
  /** Maximum bar speed (normalized units per second) */
  maxSpeed: number;
}

/** A saved lift analysis record */
export interface LiftAnalysis {
  /** Unique identifier */
  id: string;
  /** URI to the recorded/imported video */
  videoUri: string;
  /** ISO date string */
  createdAt: string;
  /** Total video duration in ms */
  durationMs: number;
  /** Approximate samples per second (e.g. 4 = markers every 250ms) */
  fpsSample: number;
  /** The initial seed point placed by the user (normalized) */
  seedPoint: { x: number; y: number };
  /** The full tracked bar path */
  barPath: BarPathPoint[];
  /** Computed metrics */
  metrics: LiftMetrics;
  /** Optional label / note from the user */
  label?: string;
}
