import { type Scene, clamp, lerp, smooth, line, rect, fill, px } from "./kit";

// Nodes link up one by one into a small network; once connected, pulses travel along the links (some orange).

type Pt = [number, number];
const NODES: Pt[] = [
  [60, 66], [150, 36], [262, 62], [104, 140], [196, 122], [304, 150], [176, 210], [56, 202],
];
const HUB = 4;
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [4, 2], [4, 5], [2, 5], [3, 6], [4, 6], [3, 7], [7, 6],
];
const node_at = (i: number) => 0.04 + i * 0.05;
const link_at = (a: number, b: number) => Math.max(node_at(a), node_at(b)) + 0.04;

export const network: Scene = {
  fig: "Fig. 013",
  caption: "Leading the team",
  draw(k, t, ms) {
    LINKS.forEach(([a, b], li) => {
      const q = clamp((t - link_at(a, b)) / 0.1);
      if (q <= 0) return;
      const [x1, y1] = NODES[a];
      const [x2, y2] = NODES[b];
      line(k, x1, y1, x2, y2, { gap: 3.4, size: 0.8, a: 0.55, q });
      if (q < 1 || t < 0.62) return;
      // a pulse on each link, leaving from alternating ends, with a short tail
      const ph = (ms / 2200 + li * 0.37) % 1;
      const fwd = Math.floor(ms / 2200 + li * 0.37) % 2 === 0;
      const hot = a === HUB || b === HUB;
      for (let s = 0; s < 4; s++) {
        const p = clamp(ph - s * 0.03);
        const r = fwd ? p : 1 - p;
        px(k, lerp(x1, x2, r), lerp(y1, y2, r), s ? 2 : 4, hot && li % 2 === 0 ? k.accent : k.ink, s ? 0.5 - s * 0.1 : 1);
      }
    });
    NODES.forEach(([x, y], i) => {
      const a = smooth((t - node_at(i)) / 0.06);
      if (a <= 0) return;
      const r = i === HUB ? 9 : 6.5;
      fill(k, x - r + 1, y - r + 1, r * 2 - 2, r * 2 - 2, i === HUB ? k.accent : k.ink, (i === HUB ? 1 : 0.14) * a);
      rect(k, x - r, y - r, r * 2, r * 2, { gap: 1.2, size: 0.9, a, color: i === HUB ? k.accent : k.ink });
    });
  },
};
