import { type Scene, W, H } from "./kit";

// Scene 7: the original hero figure, a thin dotted sheet in perspective with tokens rising out of it.

const FAR_Y = 0.68 * H; // the sheet's back edge: tokens are revealed above it, never over dots
const NEAR_Y = 0.94 * H;
const FAR_HALF = 0.34 * W;
const NEAR_HALF = 0.49 * W;
const ROWS = 15;
const COLS = 43;
const TOP_Y = 0.07 * H;
const PERIOD = 9000; // ms for one token to rise and fade
const SIZE = 11;

// One token per lane. Lanes are evenly spaced wider than the widest label, so labels cannot overlap.
const LANES: { text: string; accent: boolean }[] = [
  { text: "git", accent: false },
  { text: "ship", accent: true },
  { text: "api", accent: false },
  { text: "{}", accent: false },
  { text: "v1", accent: true },
  { text: "ok", accent: false },
];
const LANE_SPAN = 0.8 * FAR_HALF;
const laneX = (i: number) => W / 2 + ((i / (LANES.length - 1)) * 2 - 1) * LANE_SPAN;
/** Progress 0..1 of a lane's token, staggered so the lanes are never in step. */
const progress = (i: number, ms: number) => (((ms / PERIOD + (i * 5) / LANES.length) % 1) + 1) % 1;

export const sheet: Scene = {
  fig: "Fig. 007",
  caption: "Ideas, lifting off the page",
  draw(k, _t, ms) {
    const { g, s } = k;
    g.fillStyle = k.ink;
    for (let r = 0; r < ROWS; r++) {
      const t = r / (ROWS - 1);
      const y = FAR_Y + (NEAR_Y - FAR_Y) * Math.pow(t, 1.4);
      const half = FAR_HALF + (NEAR_HALF - FAR_HALF) * t;
      const d = Math.max(1, Math.round(s * (0.8 + 0.9 * t)));
      g.globalAlpha = (0.4 + 0.45 * t) * k.alpha;
      for (let c = 0; c < COLS; c++) {
        const x = W / 2 + (c / (COLS - 1) - 0.5) * 2 * half;
        g.fillRect(Math.round(x * s), Math.round(y * s), d, d);
      }
    }
    // The tokens, clipped to the area above the sheet so no label ever sits on dots.
    g.setTransform(s, 0, 0, s, 0, 0);
    g.save();
    g.beginPath();
    g.rect(0, 0, W, FAR_Y - 3);
    g.clip();
    g.font = `${SIZE}px ${k.font}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    LANES.forEach((l, i) => {
      const p = progress(i, ms + 2500);
      const y = FAR_Y + 4 - (FAR_Y + 4 - TOP_Y) * p;
      // Fade in as it leaves the sheet, then fade out the higher it gets.
      g.globalAlpha = (p < 0.1 ? p / 0.1 : Math.max(0, 1 - Math.pow((p - 0.1) / 0.9, 1.4))) * k.alpha;
      g.fillStyle = l.accent ? k.accent : k.ink;
      g.fillText(l.text, Math.round(laneX(i)), Math.round(y));
    });
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
  },
};
