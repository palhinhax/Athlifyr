import { PROMO_CONFIG } from "@/app/promo/config";
import { CROSSFIT_PROMO_CONFIG } from "@/app/promo/crossfit/config";
import { COMMUNITY_PROMO_CONFIG } from "@/app/promo/community/config";
import { RUNNING_PROMO_CONFIG } from "@/app/promo/running/config";

describe("promo configs", () => {
  const configs = [
    { name: "PROMO_CONFIG", config: PROMO_CONFIG },
    { name: "CROSSFIT_PROMO_CONFIG", config: CROSSFIT_PROMO_CONFIG },
    { name: "COMMUNITY_PROMO_CONFIG", config: COMMUNITY_PROMO_CONFIG },
    { name: "RUNNING_PROMO_CONFIG", config: RUNNING_PROMO_CONFIG },
  ];

  it.each(configs)("$name has at least one video", ({ config }) => {
    expect(config.videos.length).toBeGreaterThan(0);
  });

  it.each(configs)(
    "$name videos have valid src and positive duration",
    ({ config }) => {
      for (const video of config.videos) {
        expect(video.src).toMatch(/^\/promo\/.+\.mp4$/);
        expect(video.duration).toBeGreaterThan(0);
      }
    }
  );

  it.each(configs)("$name has finalOverlay settings", ({ config }) => {
    expect(config.finalOverlay.delay).toBeGreaterThan(0);
    expect(config.finalOverlay.tagline).toBeTruthy();
    expect(config.finalOverlay.logo).toBe("ATHLIFYR");
    expect(config.finalOverlay.subtitle).toBeTruthy();
  });

  it.each(configs)("$name has animation settings", ({ config }) => {
    expect(config.animation.videoFadeDuration).toBeGreaterThan(0);
    expect(config.animation.textFadeInDuration).toBeGreaterThan(0);
    expect(config.animation.textStagger).toBeGreaterThan(0);
  });
});
