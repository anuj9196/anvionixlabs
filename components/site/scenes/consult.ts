import { type Kit, type Scene, clamp, smooth, line, rect, fill, text, px } from "./kit";
import { box, stroke } from "./sketch";

// Scene 7: an architecture review. A small system diagram, orange review marks (a circle round the
// bottleneck, an arrow to a note, a tick), then a four-step roadmap whose dots fill in left to right.

const BOXES: { name: string; x: number; y: number; w: number; h: number }[] = [
  { name: "client", x: 28, y: 52, w: 64, h: 34 },
  { name: "api", x: 148, y: 52, w: 64, h: 34 },
  { name: "db", x: 268, y: 52, w: 64, h: 34 },
  { name: "queue", x: 148, y: 112, w: 64, h: 30 },
];
const LINKS: [number, number, number, number][] = [
  [92, 69, 148, 69],
  [212, 69, 268, 69],
  [180, 86, 180, 112],
];
const STEPS = ["audit", "plan", "build", "scale"];
const STEP_X = (i: number) => 60 + i * 80;
const ROAD_Y = 206;

/** A hand-drawn ring, a little more than one turn, drawn up to fraction q. */
function ring(k: Kit, cx: number, cy: number, rx: number, ry: number, q: number) {
  const n = Math.round(90 * q);
  if (n <= 0) return;
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (i / 90) * Math.PI * 2 * 1.08;
    const wob = 1 + 0.05 * Math.sin(a * 2 + 1);
    px(k, cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob, 1.3, k.accent);
  }
}

export const consult: Scene = {
  fig: "Fig. 007",
  caption: "A second pair of eyes",
  draw(k, t) {
    BOXES.forEach((b, i) => {
      const q = clamp((t - 0.1 - i * 0.04) / 0.1);
      if (q > 0) box(b.x, b.y, b.w, b.h).forEach((s, j) => stroke(k, s, i * 4 + j, 1, q, 0));
      const la = smooth((t - 0.2 - i * 0.04) / 0.08);
      if (la > 0) text(k, b.name, b.x + b.w / 2, b.y + b.h / 2 + 0.5, { size: 11, bold: true, align: "center", a: la });
    });
    LINKS.forEach(([x1, y1, x2, y2], i) => {
      const q = clamp((t - 0.24 - i * 0.03) / 0.1);
      line(k, x1, y1, x2, y2, { gap: 3.4, size: 0.8, a: 0.6, q });
    });
    // Review marks, in orange: ring the api-to-db link, point at a note, tick the queue.
    ring(k, 240, 69, 22, 15, clamp((t - 0.34) / 0.1));
    const aq = clamp((t - 0.44) / 0.06);
    if (aq > 0) line(k, 240, 51, 240, 51 - 13 * aq, { gap: 1.2, size: 1.1, color: k.accent });
    if (aq >= 1) {
      line(k, 240, 38, 236, 43, { gap: 1.2, size: 1.1, color: k.accent });
      line(k, 240, 38, 244, 43, { gap: 1.2, size: 1.1, color: k.accent });
    }
    const na = smooth((t - 0.5) / 0.06);
    if (na > 0) text(k, "cache here", 240, 28, { size: 11, bold: true, color: k.accent, align: "center", a: na });
    const tq = clamp((t - 0.54) / 0.06);
    line(k, 228, 128, 233, 134, { gap: 1.2, size: 1.2, color: k.accent, q: clamp(tq * 2) });
    line(k, 233, 134, 243, 121, { gap: 1.2, size: 1.2, color: k.accent, q: clamp(tq * 2 - 1) });
    const oa = smooth((t - 0.58) / 0.05);
    if (oa > 0) text(k, "ok", 255, 128, { size: 11, bold: true, color: k.accent, a: oa });
    // The roadmap: audit, plan, build, scale. The step being filled is orange, finished ones ink.
    line(k, STEP_X(0), ROAD_Y, STEP_X(3), ROAD_Y, { gap: 3.4, size: 0.8, a: 0.6, q: clamp((t - 0.6) / 0.06) });
    STEPS.forEach((name, i) => {
      const x = STEP_X(i);
      const ra = smooth((t - 0.6 - i * 0.015) / 0.05);
      if (ra <= 0) return;
      rect(k, x - 4, ROAD_Y - 4, 8, 8, { gap: 1.2, size: 0.9, a: ra });
      const f = smooth((t - 0.66 - i * 0.045) / 0.04);
      const current = i === 3 || t < 0.66 + (i + 1) * 0.045;
      if (f > 0) fill(k, x - 4, ROAD_Y - 4, 8, 8, current ? k.accent : k.ink, f);
      text(k, name, x, ROAD_Y + 18, { size: 11, align: "center", a: ra });
    });
  },
};
