import { type Scene, clamp, line, rect, px } from "./kit";

// An open notebook: ruled pages with handwriting writing itself in line by line, a pen at the head.
// The orange underline marks the heading.

const PAGES = [
  { x: 54, y: 34, w: 122, h: 176 },
  { x: 184, y: 34, w: 122, h: 176 },
];
const ROWS = 9;
const ROW_Y = (i: number) => 66 + i * 17;
// Fraction of the ruled line each written line fills: 0 = a blank gap.
const FILL = [0.62, 0.9, 0.82, 0.95, 0.5, 0.88, 0.76, 0.92, 0.4];

export const notebook: Scene = {
  fig: "Fig. 015",
  caption: "Now, in the notebook",
  draw(k, t) {
    const pq = clamp(t / 0.14);
    PAGES.forEach((p) => rect(k, p.x, p.y, p.w, p.h, { gap: 2.4, size: 0.9, a: pq }));
    // The binding down the middle.
    for (let i = 0; i < 10; i++) {
      const a = clamp((t - 0.06 - i * 0.008) / 0.04);
      if (a > 0) rect(k, 176, 40 + i * 17, 8, 8, { gap: 1.4, size: 0.9, a });
    }
    // Ruled lines.
    PAGES.forEach((p) => {
      for (let i = 0; i < ROWS; i++) {
        const q = clamp((t - 0.1 - i * 0.01) / 0.08);
        line(k, p.x + 12, ROW_Y(i) + 5, p.x + p.w - 12, ROW_Y(i) + 5, { gap: 3.6, size: 0.8, a: 0.28, q });
      }
    });
    // Handwriting: the left page, then the right, one line after another.
    let pen: [number, number] | null = null;
    PAGES.forEach((p, pi) => {
      for (let i = 0; i < ROWS; i++) {
        const idx = pi * ROWS + i;
        const q = clamp((t - 0.2 - idx * 0.03) / 0.03);
        if (q <= 0) continue;
        const heading = idx === 0;
        const f = pi === 1 && i === 8 ? 0.55 : FILL[(i + pi * 2) % FILL.length];
        const x0 = p.x + 12;
        const w = (p.w - 24) * (heading ? 0.55 : f);
        const y = ROW_Y(i);
        const n = Math.max(1, Math.round((w * q) / 3));
        for (let j = 0; j <= n; j++) {
          const u = (j / n) * q * w;
          const wob = Math.sin((u + idx * 9) * 0.55) * 1.6;
          px(k, x0 + u, y + wob * 0.5, heading ? 1.5 : 1, k.ink, heading ? 1 : 0.8);
        }
        if (q < 1) pen = [x0 + q * w, y];
        if (heading && q >= 1) line(k, x0, y + 5, x0 + w, y + 5, { gap: 1.2, size: 1.2, color: k.accent });
      }
    });
    if (pen) {
      const [x, y] = pen as [number, number];
      line(k, x, y, x + 15, y - 14, { gap: 1, size: 1.5, a: 0.9 });
      px(k, x, y, 3.2, k.accent);
    }
  },
};
