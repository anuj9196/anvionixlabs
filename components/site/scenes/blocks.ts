import { type Kit, type Scene, clamp, smooth, line, text } from "./kit";

// Scene 3: dotted isometric blocks (db, api, web, app) drop in and lock together; the app block is orange.

const U = 46;
const C = 0.866;
const S = 0.5;
const OX = 180;
const OY = 124;
const DROP = 100;

const P = (x: number, y: number, z: number, off: number): [number, number] => [OX + (x - y) * C * U, OY + (x + y) * S * U - z * U + off];

type Block = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; label: string; at: number; accent?: boolean };
const BLOCKS: Block[] = [
  { x0: 0, x1: 2, y0: 0, y1: 2, z0: 0, z1: 0.5, label: "db", at: 0.04 },
  { x0: 0, x1: 2, y0: 0, y1: 2, z0: 0.5, z1: 1, label: "api", at: 0.2 },
  { x0: 0, x1: 1, y0: 0, y1: 2, z0: 1, z1: 1.8, label: "web", at: 0.36 },
  { x0: 1, x1: 2, y0: 0, y1: 2, z0: 1, z1: 1.8, label: "app", at: 0.52, accent: true },
];
const FALL = 0.2;

/** Vertical offset: an accelerating fall, then a small rebound as it locks in. */
function dropOffset(tau: number) {
  if (tau <= 0) return -DROP;
  if (tau < 0.8) return -DROP * (1 - Math.pow(tau / 0.8, 2));
  if (tau < 1) return -3 * Math.sin(((tau - 0.8) / 0.2) * Math.PI);
  return 0;
}

function poly(k: Kit, pts: [number, number][], color: string, a: number) {
  const g = k.g;
  g.globalAlpha = a * k.alpha;
  g.fillStyle = color;
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x * k.s, y * k.s) : g.moveTo(x * k.s, y * k.s)));
  g.closePath();
  g.fill();
}

function drawBlock(k: Kit, b: Block, off: number, a: number, showTop: boolean, showRight: boolean) {
  const col = b.accent ? k.accent : k.ink;
  const o = { gap: 2.4, size: 0.9, color: col, a };
  const L = [P(b.x0, b.y1, b.z0, off), P(b.x1, b.y1, b.z0, off), P(b.x1, b.y1, b.z1, off), P(b.x0, b.y1, b.z1, off)];
  const R = [P(b.x1, b.y1, b.z0, off), P(b.x1, b.y0, b.z0, off), P(b.x1, b.y0, b.z1, off), P(b.x1, b.y1, b.z1, off)];
  const T = [P(b.x0, b.y0, b.z1, off), P(b.x1, b.y0, b.z1, off), P(b.x1, b.y1, b.z1, off), P(b.x0, b.y1, b.z1, off)];
  if (b.accent) {
    poly(k, T, k.accent, 0.5 * a);
    poly(k, R, k.accent, 0.78 * a);
    poly(k, L, k.accent, 0.96 * a);
  }
  const edge = (p: [number, number][]) => p.forEach((q, i) => line(k, q[0], q[1], p[(i + 1) % 4][0], p[(i + 1) % 4][1], o));
  edge(L);
  if (showRight) {
    edge(R);
    if (!b.accent) {
      // dotted hatch on the right-hand face, so it reads as the shaded side
      const [ax, ay] = R[0];
      const [bx, by] = R[1];
      for (let x = ax + 3.4; x < bx; x += 3.4) {
        const yb = ay + ((x - ax) * (by - ay)) / (bx - ax);
        line(k, x, yb, x, yb - (b.z1 - b.z0) * U, { gap: 3.4, size: 0.8, a: 0.5 * a });
      }
    }
  }
  if (showTop) edge(T);
  // The label sits flat on the left face.
  const mid = P((b.x0 + b.x1) / 2, b.y1, (b.z0 + b.z1) / 2, off);
  text(k, b.label, mid[0], mid[1], { size: 11, color: b.accent ? k.accentInk : k.ink, a, align: "center", bold: true, skew: [C, S] });
}

export const blocks: Scene = {
  fig: "Fig. 003",
  caption: "Pieces that fit",
  draw(k, t) {
    BLOCKS.forEach((b, i) => {
      const tau = (t - b.at) / FALL;
      if (tau <= 0) return;
      const a = clamp(tau / 0.4);
      const off = dropOffset(tau);
      if (tau < 1) {
        // faint landing guides, so the drop reads as aiming for its slot
        for (const [x, y] of [P(b.x0, b.y1, b.z0, 0), P(b.x1, b.y1, b.z0, 0)]) line(k, x, y + off, x, y, { gap: 4, size: 0.8, a: 0.3 * a });
      }
      const next = BLOCKS[i + 1];
      const covered = !!next && t >= next.at; // the next layer is dropping onto this one
      drawBlock(k, b, off, smooth(a), b.z0 === 1 || !covered, b.x1 === 2 || !covered);
    });
  },
};
