import { type Kit, type Scene, clamp, lerp, smooth, rn, line, fill, text } from "./kit";

// Scene 1: a rough, jittery dotted wireframe that sharpens into a crisp UI card with one orange button.

type Stroke = [number, number, number, number];
const CX = 80;
const CY = 18;
const CW = 200;
const CH = 208;

const box = (x: number, y: number, w: number, h: number): Stroke[] => [
  [x, y, x + w, y],
  [x + w, y, x + w, y + h],
  [x + w, y + h, x, y + h],
  [x, y + h, x, y],
];

// In drawing order: frame, header, title, panels, copy lines.
const STROKES: Stroke[] = [
  ...box(CX, CY, CW, CH),
  [CX, 44, CX + CW, 44],
  ...box(92, 26, 10, 10),
  [226, 35, 244, 35],
  [254, 35, 270, 35],
  [92, 62, 190, 62],
  [92, 63, 190, 63],
  [92, 76, 232, 76],
  [92, 86, 212, 86],
  ...box(92, 100, 84, 50),
  ...box(184, 100, 84, 50),
  [106, 142, 106, 128],
  [120, 142, 120, 118],
  [134, 142, 134, 124],
  [148, 142, 148, 110],
  [196, 138, 214, 126],
  [214, 126, 230, 132],
  [230, 132, 248, 112],
  [248, 112, 260, 118],
  [92, 164, 262, 164],
  [92, 174, 238, 174],
  [92, 184, 252, 184],
];
const BTN = { x: 92, y: 194, w: 92, h: 22 };
const BTN_STROKES = box(BTN.x, BTN.y, BTN.w, BTN.h);

function stroke(k: Kit, s: Stroke, i: number, p: number, q: number, f: number, color?: string) {
  const [x1, y1, x2, y2] = s;
  if (p >= 1) return line(k, x1, y1, x2, y2, { gap: 0.7, size: 0.7, color, q });
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const gap = lerp(3.4, 0.8, p);
  const amp = (1 - p) * 1.7;
  const ext = (1 - p) * 3; // rough strokes overshoot their corners
  const ax = x1 - ((x2 - x1) / len) * ext;
  const ay = y1 - ((y2 - y1) / len) * ext;
  const bx = x2 + ((x2 - x1) / len) * ext;
  const by = y2 + ((y2 - y1) / len) * ext;
  const n = Math.max(1, Math.round((len * q) / gap));
  for (let j = 0; j <= n; j++) {
    const tt = (j / n) * q;
    const off = (1 - p) * Math.sin(tt * len * 0.08 + i) * 1.3 + rn(j + i * 17, f) * amp;
    const x = lerp(ax, bx, tt) + nx * off;
    const y = lerp(ay, by, tt) + ny * off;
    line(k, x, y, x, y, { size: lerp(1.1, 0.7, p), color, a: lerp(0.8, 1, p) });
  }
}

export const sketch: Scene = {
  fig: "Fig. 001",
  caption: "Sketch, made real",
  draw(k, t, ms) {
    const p = smooth((t - 0.42) / 0.3);
    const f = Math.floor(ms / 120); // the sketch "boils": new jitter every few frames
    const n = STROKES.length;
    STROKES.forEach((s, i) => {
      const q = clamp((t - (i / n) * 0.3) / 0.1);
      if (q > 0) stroke(k, s, i, p, q, f);
    });
    // The one orange button: outlined while rough, filled and labelled once crisp.
    const bq = clamp((t - 0.3) / 0.1);
    if (bq > 0) {
      const fa = smooth((t - 0.62) / 0.12);
      if (fa > 0) fill(k, BTN.x, BTN.y, BTN.w, BTN.h, k.accent, fa);
      BTN_STROKES.forEach((s, i) => stroke(k, s, 40 + i, p, bq, f, k.accent));
    }
    const la = smooth((t - 0.74) / 0.1);
    if (la > 0) text(k, "Get started", BTN.x + BTN.w / 2, BTN.y + BTN.h / 2 + 0.5, { size: 10, color: k.accentInk, a: la, align: "center", bold: true });
    // A hard offset shadow, the last bit of polish.
    const sa = smooth((t - 0.7) / 0.15);
    if (sa > 0) {
      line(k, CX + 5, CY + CH + 5, CX + CW + 5, CY + CH + 5, { gap: 3, size: 0.9, a: 0.45 * sa });
      line(k, CX + CW + 5, CY + 5, CX + CW + 5, CY + CH + 5, { gap: 3, size: 0.9, a: 0.45 * sa });
    }
  },
};
