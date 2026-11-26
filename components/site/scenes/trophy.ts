import { type Kit, type Scene, clamp, smooth, line, px, fill } from "./kit";

// A dotted trophy drawn from the rim down, with an orange star on the cup and a glint that pulses.

const CX = 180;
const TOPY = 52;
const BOWL = 86;

const halfWidth = (s: number) => 8 + 44 * (1 - Math.pow(s, 1.7));

function curve(k: Kit, side: 1 | -1, q: number) {
  const n = Math.round(60 * q);
  let prev: [number, number] | null = null;
  for (let i = 0; i <= n; i++) {
    const s = i / 60;
    const p: [number, number] = [CX + side * halfWidth(s), TOPY + s * BOWL];
    if (prev) line(k, prev[0], prev[1], p[0], p[1], { gap: 2.2, size: 0.9 });
    prev = p;
  }
}

function handle(k: Kit, side: 1 | -1, q: number) {
  const cx = CX + side * 54;
  const cy = 86;
  const n = Math.round(24 * q);
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (i / 24) * Math.PI;
    px(k, cx + side * Math.cos(a) * 20, cy + Math.sin(a) * 24, 0.9, k.ink);
  }
}

function star(k: Kit, cx: number, cy: number, r: number, a: number) {
  const g = k.g;
  g.globalAlpha = a * k.alpha;
  g.fillStyle = k.accent;
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.42 : r;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = (cx + Math.cos(ang) * rr) * k.s;
    const y = (cy + Math.sin(ang) * rr) * k.s;
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  }
  g.closePath();
  g.fill();
}

export const trophy: Scene = {
  fig: "Fig. 014",
  caption: "Engineering Excellence",
  draw(k, t, ms) {
    const cq = clamp((t - 0.04) / 0.28);
    line(k, CX - 52, TOPY, CX + 52, TOPY, { gap: 2.2, size: 0.9, q: clamp(cq * 3) });
    curve(k, -1, cq);
    curve(k, 1, cq);
    const hq = clamp((t - 0.3) / 0.14);
    handle(k, -1, hq);
    handle(k, 1, hq);
    // dotted tone inside the cup
    const ta = smooth((t - 0.34) / 0.14);
    if (ta > 0) {
      for (let y = TOPY + 8; y < TOPY + BOWL - 6; y += 5) {
        const hw = halfWidth((y - TOPY) / BOWL) - 5;
        if (hw > 2) line(k, CX - hw, y, CX + hw, y, { gap: 4, size: 0.8, a: 0.3 * ta });
      }
    }
    const sq = clamp((t - 0.44) / 0.1);
    line(k, CX - 7, TOPY + BOWL, CX - 7, 160, { gap: 2.2, size: 0.9, q: sq });
    line(k, CX + 7, TOPY + BOWL, CX + 7, 160, { gap: 2.2, size: 0.9, q: sq });
    const bq = clamp((t - 0.5) / 0.1);
    if (bq > 0) {
      for (const [x1, y1, x2, y2] of [[148, 160, 212, 176], [128, 176, 232, 196]]) {
        line(k, x1, y1, x2, y1, { gap: 2.2, size: 0.9, q: bq });
        line(k, x2, y1, x2, y2, { gap: 2.2, size: 0.9, q: bq });
        line(k, x2, y2, x1, y2, { gap: 2.2, size: 0.9, q: bq });
        line(k, x1, y2, x1, y1, { gap: 2.2, size: 0.9, q: bq });
      }
      fill(k, 128, 176, 104, 20, k.ink, 0.1 * bq);
    }
    // the star lands on the cup, then a glint twinkles at its shoulder
    const sa = smooth((t - 0.62) / 0.1);
    if (sa > 0) star(k, CX, 98, 16 * (1.3 - 0.3 * sa), sa);
    if (t > 0.72) {
      const g = 0.5 + 0.5 * Math.sin(ms / 420);
      const r = 5 + 8 * g;
      const gx = 228;
      const gy = 56;
      line(k, gx - r, gy, gx + r, gy, { gap: 1.2, size: 1.1, color: k.accent, a: 0.5 + 0.5 * g });
      line(k, gx, gy - r, gx, gy + r, { gap: 1.2, size: 1.1, color: k.accent, a: 0.5 + 0.5 * g });
      px(k, gx, gy, 3, k.accent);
    }
  },
};
