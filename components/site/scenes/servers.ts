import { type Scene, clamp, smooth, line, rect, fill, px } from "./kit";

// A server rack in the dotted style: units slide in one by one, then their LEDs blink, a few of them orange.

const L = 104;
const R = 256;
const TOP = 22;
const UNITS = 5;
const UH = 34;
const GAP = 6;

export const servers: Scene = {
  fig: "Fig. 012",
  caption: "Building at scale",
  draw(k, t, ms) {
    const frame = clamp(t / 0.15);
    const bottom = TOP + 10 + UNITS * (UH + GAP);
    line(k, L - 8, TOP, R + 8, TOP, { gap: 2.4, size: 0.9, q: frame });
    line(k, L - 8, TOP, L - 8, bottom, { gap: 2.4, size: 0.9, q: frame });
    line(k, R + 8, TOP, R + 8, bottom, { gap: 2.4, size: 0.9, q: frame });
    line(k, L - 16, bottom, R + 16, bottom, { gap: 2.4, size: 0.9, q: frame });
    line(k, L - 8, bottom + 5, L - 8, bottom + 5, { size: 1 });
    for (let i = 0; i < UNITS; i++) {
      const a = smooth((t - 0.12 - i * 0.07) / 0.1);
      if (a <= 0) continue;
      const y = TOP + 8 + i * (UH + GAP) + (1 - a) * 14;
      rect(k, L, y, R - L, UH, { gap: 2.4, size: 0.9, a });
      fill(k, L, y, R - L, UH, k.ink, 0.06 * a);
      // vents on the left, drive bays in the middle
      for (let j = 0; j < 4; j++) line(k, L + 10, y + 9 + j * 5.5, L + 52, y + 9 + j * 5.5, { gap: 3, size: 0.8, a: 0.45 * a });
      for (let j = 0; j < 3; j++) rect(k, L + 66 + j * 22, y + 9, 16, 16, { gap: 3, size: 0.8, a: 0.5 * a });
      // LEDs on the right: the first of each unit blinks, the unit's orange one is always the busier
      if (t > 0.5) {
        for (let j = 0; j < 2; j++) {
          const on = Math.sin(ms / (260 + i * 90 + j * 140) + i * 2.1 + j) > (j === 0 ? -0.4 : 0.2);
          const orange = (i + j) % 2 === 0;
          px(k, R - 22 + j * 10, y + UH / 2, 4.6, orange ? k.accent : k.ink, on ? 1 : 0.22);
        }
      } else {
        px(k, R - 22, y + UH / 2, 4.6, k.ink, 0.3 * a);
        px(k, R - 12, y + UH / 2, 4.6, k.ink, 0.3 * a);
      }
    }
  },
};
