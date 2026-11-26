import { type Scene, clamp, smooth, line, fill, text } from "./kit";
import { type Stroke, stroke, box } from "./sketch";

// Scene 2: a rough dotted phone with a sketched app screen sharpens into a crisp mobile screen with one orange button.

const PX = 125;
const PY = 12;
const PW = 110;
const PH = 226;
const BTN = { x: PX + 10, y: 172, w: PW - 20, h: 22 };
const ROWS = [58, 96, 134];

/** A rounded rectangle as short strokes: four edges and a corner arc of radius r on each. */
function roundBox(x: number, y: number, w: number, h: number, r: number): Stroke[] {
  const out: Stroke[] = [
    [x + r, y, x + w - r, y],
    [x + w, y + r, x + w, y + h - r],
    [x + w - r, y + h, x + r, y + h],
    [x, y + h - r, x, y + r],
  ];
  const N = 6;
  [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]].forEach(([cx, cy, a0]) => {
    for (let i = 0; i < N; i++) {
      const [a, b] = [((a0 + (90 * i) / N) * Math.PI) / 180, ((a0 + (90 * (i + 1)) / N) * Math.PI) / 180];
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), cx + r * Math.cos(b), cy + r * Math.sin(b)]);
    }
  });
  return out;
}

// In drawing order: phone, status bar, header, list cards, tab bar.
const STROKES: Stroke[] = [
  ...roundBox(PX, PY, PW, PH, 20),
  ...roundBox(PX + 37, PY + 6, 36, 8, 4),
  [PX + 10, 26, PX + 28, 26],
  ...box(PX + PW - 28, 23, 16, 7),
  [PX + 10, 40, PX + 56, 40],
  ...box(PX + PW - 24, 35, 12, 10),
  [PX, 52, PX + PW, 52],
  ...ROWS.flatMap((y) => [...box(PX + 8, y, PW - 16, 32), ...box(PX + 14, y + 6, 20, 20), [PX + 42, y + 11, PX + 92, y + 11] as Stroke, [PX + 42, y + 21, PX + 78, y + 21] as Stroke]),
  [PX, 204, PX + PW, 204],
  ...[0, 1, 2, 3].flatMap((i) => box(PX + 14 + i * 24, 212, 12, 12)),
  [PX + 35, PY + PH - 6, PX + 75, PY + PH - 6],
];
const BTN_STROKES = box(BTN.x, BTN.y, BTN.w, BTN.h);

export const mobile: Scene = {
  fig: "Fig. 002",
  caption: "Pocket-sized, made real",
  draw(k, t, ms) {
    const p = smooth((t - 0.42) / 0.3);
    const f = Math.floor(ms / 120);
    const n = STROKES.length;
    STROKES.forEach((s, i) => {
      const q = clamp((t - (i / n) * 0.3) / 0.1);
      if (q > 0) stroke(k, s, i, p, q, f);
    });
    // Once crisp: soft avatar fills and an inked active tab.
    const ca = smooth((t - 0.62) / 0.12);
    if (ca > 0) {
      ROWS.forEach((y) => fill(k, PX + 14, y + 6, 20, 20, k.ink, 0.14 * ca));
      fill(k, PX + 14 + 24, 212, 12, 12, k.ink, 0.8 * ca);
      fill(k, PX + 37, PY + 6, 36, 8, k.ink, 0.9 * ca); // island pill
      fill(k, PX + 35, PY + PH - 7, 40, 2.5, k.ink, 0.85 * ca); // home indicator
    }
    const bq = clamp((t - 0.3) / 0.1);
    if (bq > 0) {
      const fa = smooth((t - 0.62) / 0.12);
      if (fa > 0) fill(k, BTN.x, BTN.y, BTN.w, BTN.h, k.accent, fa);
      BTN_STROKES.forEach((s, i) => stroke(k, s, 90 + i, p, bq, f, k.accent));
    }
    const la = smooth((t - 0.66) / 0.1);
    if (la > 0) text(k, "Order now", BTN.x + BTN.w / 2, BTN.y + BTN.h / 2 + 0.5, { size: 10, color: k.accentInk, a: la, align: "center", bold: true });
    const sa = smooth((t - 0.7) / 0.15);
    if (sa > 0) {
      line(k, PX + 5, PY + PH + 5, PX + PW + 5, PY + PH + 5, { gap: 3, size: 0.9, a: 0.45 * sa });
      line(k, PX + PW + 5, PY + 5, PX + PW + 5, PY + PH + 5, { gap: 3, size: 0.9, a: 0.45 * sa });
    }
  },
};
