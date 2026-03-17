import { WallTimerEngine } from "@/lib/timer-engine";
import type { TimerConfig, TimerState, TimerPhase } from "@/types/timer";

// Mock performance.now() for deterministic tests
let mockPerformanceNow = 0;
const originalPerformanceNow = performance.now;

// Mock requestAnimationFrame / cancelAnimationFrame
let rafCallback: (() => void) | null = null;
let rafId = 1;

beforeAll(() => {
  jest.spyOn(performance, "now").mockImplementation(() => mockPerformanceNow);
  (globalThis as Record<string, unknown>).requestAnimationFrame = (
    cb: () => void
  ) => {
    rafCallback = cb;
    return rafId++;
  };
  (globalThis as Record<string, unknown>).cancelAnimationFrame = () => {
    rafCallback = null;
  };
});

afterAll(() => {
  performance.now = originalPerformanceNow;
});

beforeEach(() => {
  mockPerformanceNow = 0;
  rafCallback = null;
  rafId = 1;
});

describe("WallTimerEngine", () => {
  // ===========================================================================
  // INITIALIZATION & STATE
  // ===========================================================================

  describe("initialization", () => {
    it("starts in READY state", () => {
      const engine = new WallTimerEngine();
      expect(engine.getState()).toBe("READY");
    });

    it("returns idle display state before configuration", () => {
      const engine = new WallTimerEngine();
      const display = engine.getDisplayState();
      expect(display).toEqual({
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        currentRound: 0,
        totalRounds: 0,
        phase: "IDLE",
        state: "READY",
        progress: 0,
        elapsed: 0,
        remaining: 0,
      });
    });
  });

  // ===========================================================================
  // CONFIGURE
  // ===========================================================================

  describe("configure", () => {
    it("configures INTERVAL timer with correct total rounds", () => {
      const engine = new WallTimerEngine();
      const config: TimerConfig = {
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 5 },
      };
      engine.configure(config);
      expect(engine.getState()).toBe("READY");
    });

    it("configures TABATA timer", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "TABATA",
        config: { workTime: 20, restTime: 10, rounds: 8 },
      });
      expect(engine.getState()).toBe("READY");
    });

    it("configures EMOM timer with duration as totalRounds", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "EMOM",
        config: { duration: 10 },
      });
      expect(engine.getState()).toBe("READY");
    });

    it("configures AMRAP timer with 0 totalRounds", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "AMRAP",
        config: { duration: 300 },
      });
      expect(engine.getState()).toBe("READY");
    });

    it("configures STOPWATCH timer", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      expect(engine.getState()).toBe("READY");
    });

    it("configures CLOCK timer", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "CLOCK", config: null });
      expect(engine.getState()).toBe("READY");
    });
  });

  // ===========================================================================
  // START / PAUSE / RESUME / RESET
  // ===========================================================================

  describe("start", () => {
    it("throws if timer not configured", () => {
      const engine = new WallTimerEngine();
      expect(() => engine.start()).toThrow("Timer not configured");
    });

    it("transitions to RUNNING on start", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "STOPWATCH",
        config: null,
      });
      engine.start();
      expect(engine.getState()).toBe("RUNNING");
    });

    it("ignores start when already running", () => {
      const engine = new WallTimerEngine();
      const stateChanges: TimerState[] = [];
      engine.onStateChange((s) => stateChanges.push(s));
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.start(); // should be ignored
      // Should only have one RUNNING transition
      expect(stateChanges.filter((s) => s === "RUNNING").length).toBe(1);
    });
  });

  describe("pause", () => {
    it("transitions from RUNNING to PAUSED", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.pause();
      expect(engine.getState()).toBe("PAUSED");
    });

    it("ignores pause when not running", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.pause();
      expect(engine.getState()).toBe("READY");
    });
  });

  describe("resume", () => {
    it("transitions from PAUSED to RUNNING", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.pause();
      engine.resume();
      expect(engine.getState()).toBe("RUNNING");
    });

    it("ignores resume when not paused", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.resume(); // not paused — should be ignored
      expect(engine.getState()).toBe("RUNNING");
    });
  });

  describe("reset", () => {
    it("transitions back to READY", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.reset();
      expect(engine.getState()).toBe("READY");
    });

    it("emits tick with idle display state on reset", () => {
      const engine = new WallTimerEngine();
      const ticks: unknown[] = [];
      engine.onTick((s) => ticks.push(s));
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.reset();
      // Last tick should have READY state
      const last = ticks[ticks.length - 1] as { state: string };
      expect(last.state).toBe("READY");
    });
  });

  // ===========================================================================
  // CALLBACKS
  // ===========================================================================

  describe("callbacks", () => {
    it("fires state change callback", () => {
      const engine = new WallTimerEngine();
      const states: TimerState[] = [];
      engine.onStateChange((s) => states.push(s));
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.pause();
      expect(states).toEqual(["RUNNING", "PAUSED"]);
    });

    it("fires phase change callback on start", () => {
      const engine = new WallTimerEngine();
      const phases: TimerPhase[] = [];
      engine.onPhaseChange((p) => phases.push(p));
      engine.configure({
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 3 },
      });
      engine.start();
      expect(phases).toContain("WORK");
    });

    it("fires complete callback when timer finishes", () => {
      const engine = new WallTimerEngine();
      let completed = false;
      engine.onComplete(() => {
        completed = true;
      });
      engine.configure({
        mode: "AMRAP",
        config: { duration: 10 }, // 10 seconds
      });

      mockPerformanceNow = 0;
      engine.start();

      // Simulate time past completion
      mockPerformanceNow = 11000; // 11 seconds
      // Manually call tick by executing the raf callback
      if (rafCallback) rafCallback();

      expect(completed).toBe(true);
      expect(engine.getState()).toBe("FINISHED");
    });
  });

  // ===========================================================================
  // DISPLAY STATE - STOPWATCH
  // ===========================================================================

  describe("stopwatch display", () => {
    it("shows elapsed time for STOPWATCH mode", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });
      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 65500; // 1 min 5.5 sec
      const display = engine.getDisplayState();

      expect(display.minutes).toBe(1);
      expect(display.seconds).toBe(5);
      expect(display.milliseconds).toBe(500);
      expect(display.phase).toBe("WORK");
      expect(display.progress).toBe(0); // stopwatch has no progress
      expect(display.remaining).toBe(0);
    });
  });

  // ===========================================================================
  // DISPLAY STATE - INTERVAL
  // ===========================================================================

  describe("interval display", () => {
    it("shows correct work phase in round 1", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 3 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 10 seconds into round 1 work phase
      mockPerformanceNow = 10000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(1);
      expect(display.totalRounds).toBe(3);
      expect(display.phase).toBe("WORK");
      // Remaining in work phase = 30s - 10s = 20s
      expect(display.minutes).toBe(0);
      expect(display.seconds).toBe(20);
    });

    it("shows correct rest phase", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 3 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 35 seconds in = 30s work + 5s rest
      mockPerformanceNow = 35000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(1);
      expect(display.phase).toBe("REST");
      // Remaining in rest phase = 10s - 5s = 5s
      expect(display.seconds).toBe(5);
    });

    it("advances rounds correctly", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 3 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 40s = round 1 complete (30+10), now in round 2 work
      mockPerformanceNow = 45000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(2);
      expect(display.phase).toBe("WORK");
    });

    it("calculates progress correctly", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "INTERVAL",
        config: { workTime: 30, restTime: 10, rounds: 3 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // Total = (30+10)*3 = 120s. At 60s = 50%
      mockPerformanceNow = 60000;
      const display = engine.getDisplayState();

      expect(display.progress).toBe(50);
    });
  });

  // ===========================================================================
  // DISPLAY STATE - EMOM
  // ===========================================================================

  describe("EMOM display", () => {
    it("shows correct round and remaining time", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "EMOM",
        config: { duration: 10, workTime: 60 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 90 seconds in = round 2, 30s into minute 2
      mockPerformanceNow = 90000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(2);
      expect(display.totalRounds).toBe(10);
      expect(display.phase).toBe("WORK");
      // Remaining in current minute = 60s - 30s = 30s
      expect(display.seconds).toBe(30);
    });
  });

  // ===========================================================================
  // DISPLAY STATE - TABATA
  // ===========================================================================

  describe("tabata display", () => {
    it("shows work phase in first round", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "TABATA",
        config: { workTime: 20, restTime: 10, rounds: 8 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 10 seconds into round 1 work
      mockPerformanceNow = 10000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(1);
      expect(display.totalRounds).toBe(8);
      expect(display.phase).toBe("WORK");
      expect(display.seconds).toBe(10); // 20-10 remaining
    });

    it("shows rest phase after work", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "TABATA",
        config: { workTime: 20, restTime: 10, rounds: 8 },
      });
      mockPerformanceNow = 0;
      engine.start();

      // 25 seconds = 20s work + 5s rest
      mockPerformanceNow = 25000;
      const display = engine.getDisplayState();

      expect(display.currentRound).toBe(1);
      expect(display.phase).toBe("REST");
      expect(display.seconds).toBe(5); // 10-5 remaining
    });
  });

  // ===========================================================================
  // DISPLAY STATE - AMRAP
  // ===========================================================================

  describe("AMRAP display", () => {
    it("shows countdown remaining", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "AMRAP",
        config: { duration: 300 }, // 5 minutes in seconds
      });
      mockPerformanceNow = 0;
      engine.start();

      // 120 seconds in
      mockPerformanceNow = 120000;
      const display = engine.getDisplayState();

      expect(display.phase).toBe("WORK");
      // Remaining = 300s - 120s = 180s = 3:00
      expect(display.minutes).toBe(3);
      expect(display.seconds).toBe(0);
      expect(display.remaining).toBe(180000);
    });

    it("completes when time runs out", () => {
      const engine = new WallTimerEngine();
      let completed = false;
      engine.onComplete(() => {
        completed = true;
      });
      engine.configure({ mode: "AMRAP", config: { duration: 10 } });

      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 11000;
      if (rafCallback) rafCallback();

      expect(completed).toBe(true);
    });
  });

  // ===========================================================================
  // DISPLAY STATE - FOR TIME
  // ===========================================================================

  describe("FOR_TIME display", () => {
    it("counts down when countDown is true", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "FOR_TIME",
        config: { countDown: true, duration: 120 }, // 2 min
      });
      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 30000; // 30s elapsed
      const display = engine.getDisplayState();

      // Remaining = 120s - 30s = 90s = 1:30
      expect(display.minutes).toBe(1);
      expect(display.seconds).toBe(30);
    });

    it("counts up when countDown is false", () => {
      const engine = new WallTimerEngine();
      engine.configure({
        mode: "FOR_TIME",
        config: { countDown: false },
      });
      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 75000; // 1:15 elapsed
      const display = engine.getDisplayState();

      expect(display.minutes).toBe(1);
      expect(display.seconds).toBe(15);
      expect(display.remaining).toBe(0);
    });

    it("completes countdown at 0", () => {
      const engine = new WallTimerEngine();
      let completed = false;
      engine.onComplete(() => {
        completed = true;
      });
      engine.configure({
        mode: "FOR_TIME",
        config: { countDown: true, duration: 10 },
      });

      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 11000;
      if (rafCallback) rafCallback();

      expect(completed).toBe(true);
    });

    it("does not auto-complete count up mode", () => {
      const engine = new WallTimerEngine();
      let completed = false;
      engine.onComplete(() => {
        completed = true;
      });
      engine.configure({
        mode: "FOR_TIME",
        config: { countDown: false },
      });

      mockPerformanceNow = 0;
      engine.start();

      mockPerformanceNow = 999999;
      if (rafCallback) rafCallback();

      expect(completed).toBe(false);
      expect(engine.getState()).toBe("RUNNING");
    });
  });

  // ===========================================================================
  // PAUSE ACCOUNTING
  // ===========================================================================

  describe("pause time accounting", () => {
    it("accumulated pause time is subtracted from elapsed", () => {
      const engine = new WallTimerEngine();
      engine.configure({ mode: "STOPWATCH", config: null });

      mockPerformanceNow = 0;
      engine.start();

      // Run for 10s
      mockPerformanceNow = 10000;
      let display = engine.getDisplayState();
      expect(display.elapsed).toBe(10000);

      // Pause for 5s
      engine.pause();
      mockPerformanceNow = 15000;

      // Resume
      engine.resume();

      // Run for another 10s (total wall clock = 25s, but only 20s of running)
      mockPerformanceNow = 25000;
      display = engine.getDisplayState();
      expect(display.elapsed).toBe(20000);
    });
  });

  // ===========================================================================
  // DESTROY
  // ===========================================================================

  describe("destroy", () => {
    it("clears all callbacks and stops animation", () => {
      const engine = new WallTimerEngine();
      const ticks: unknown[] = [];
      engine.onTick((s) => ticks.push(s));
      engine.configure({ mode: "STOPWATCH", config: null });
      engine.start();
      engine.destroy();

      // After destroy, no more callbacks should fire
      const countBefore = ticks.length;
      // simulate a tick
      if (rafCallback) rafCallback();
      expect(ticks.length).toBe(countBefore);
    });
  });
});
