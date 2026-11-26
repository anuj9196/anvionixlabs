import { type Scene, clamp, lerp, smooth, line, px, fill, text } from "./kit";

// Scene 3: branch lines grow upward, split and merge, and end at an orange "v1.0 · shipped" tag.

type Seg = { a: [number, number]; b: [number, number]; t0: number; t1: number };
const M = 180;
const SEGS: Seg[] = [
  { a: [M, 222], b: [M, 190], t0: 0.0, t1: 0.08 },
  { a: [M, 190], b: [M, 160], t0: 0.08, t1: 0.14 },
  { a: [M, 160], b: [M, 90], t0: 0.14, t1: 0.4 },
  { a: [M, 90], b: [M, 60], t0: 0.4, t1: 0.46 },
  { a: [M, 60], b: [M, 40], t0: 0.46, t1: 0.52 },
  // feat/api splits to the right and merges back
  { a: [M, 190], b: [230, 165], t0: 0.1, t1: 0.18 },
  { a: [230, 165], b: [230, 115], t0: 0.18, t1: 0.32 },
  { a: [230, 115], b: [M, 90], t0: 0.32, t1: 0.4 },
  // feat/ui splits to the left and merges back
  { a: [M, 160], b: [130, 135], t0: 0.16, t1: 0.24 },
  { a: [130, 135], b: [130, 85], t0: 0.24, t1: 0.38 },
  { a: [130, 85], b: [M, 60], t0: 0.38, t1: 0.46 },
];
// Nodes: position and the moment they appear.
const NODES: [number, number, number][] = [
  [M, 222, 0.0],
  [M, 190, 0.08],
  [M, 160, 0.14],
  [230, 165, 0.18],
  [230, 140, 0.25],
  [230, 115, 0.32],
  [130, 135, 0.24],
  [130, 110, 0.31],
  [130, 85, 0.38],
  [M, 90, 0.4],
  [M, 60, 0.46],
];

export const commits: Scene = {
  fig: "Fig. 003",
  caption: "Branches, merged and shipped",
  draw(k, t) {
    for (const s of SEGS) {
      const q = clamp((t - s.t0) / (s.t1 - s.t0));
      line(k, s.a[0], s.a[1], s.b[0], s.b[1], { gap: 3.2, size: 0.9, q });
    }
    for (const [x, y, at] of NODES) {
      const a = smooth((t - at) / 0.05);
      if (a > 0) px(k, x, y, lerp(7, 4.6, a), k.ink, a);
    }
    const la = smooth((t - 0.2) / 0.1);
    text(k, "main", M, 238, { size: 8, a: 0.6 * la, align: "center" });
    text(k, "feat/api", 240, 140, { size: 8, a: 0.6 * smooth((t - 0.26) / 0.1) });
    text(k, "feat/ui", 120, 110, { size: 8, a: 0.6 * smooth((t - 0.32) / 0.1), align: "right" });
    // The release tag: drops onto the top of the main line.
    const ta = smooth((t - 0.54) / 0.14);
    if (ta > 0) {
      const y = 8 - (1 - ta) * 10;
      line(k, M, y + 20, M, 40, { gap: 3, size: 0.9, color: k.accent, a: ta });
      px(k, M, 40, 6, k.accent, ta);
      fill(k, 126, y, 108, 20, k.accent, ta);
      text(k, "v1.0 · shipped", M, y + 10.5, { size: 10, color: k.accentInk, a: ta, align: "center", bold: true });
    }
  },
};
