import { type Scene, clamp, lerp, smooth, line, fill, text, fs, px } from "./kit";

// A receipt slip prints out of a slot at the top: dotted paper with a zigzag tear, lines typed in mono,
// then an orange stamp. Wording is only what the pricing page already says: a free scoping call, quoted in writing.

const L = 36;
const R = 324;
const TOP = 28;
const END = 312;
/** The slip is drawn for a taller design space than the other scenes. */
export const SLIP_DESIGN = [360, 340] as const;
const ROWS: { name: string; result: string; free?: boolean }[] = [
  { name: "audit", result: "✓" },
  { name: "mvp", result: "✓" },
  { name: "retainer", result: "✓" },
  { name: "scoping call", result: "free", free: true },
];
const ROW_Y = (i: number) => 118 + i * 32;

function zigzag(k: Parameters<typeof line>[0], y: number, a: number) {
  const n = (R - L) / 8;
  for (let i = 0; i < n; i++) {
    const x = L + i * 8;
    line(k, x, y, x + 4, y + 5, { gap: 1.6, size: 0.8, a });
    line(k, x + 4, y + 5, x + 8, y, { gap: 1.6, size: 0.8, a });
  }
}

export const slip: Scene = {
  fig: "Fig. 009",
  caption: "Quoted in writing",
  draw(k, t) {
    // The slot, with a light that blinks while printing.
    fill(k, L - 16, 12, R - L + 32, 9, k.ink, 0.85);
    line(k, L - 16, 25, R + 16, 25, { gap: 3, size: 0.8, a: 0.4 });
    const printing = t > 0.04 && t < 0.58;
    px(k, R + 28, 16, 5, printing && Math.floor(t * 40) % 2 === 0 ? k.accent : k.ink, printing ? 1 : 0.4);

    // The paper grows down out of the slot.
    const edge = TOP + (END - TOP) * smooth((t - 0.04) / 0.5);
    if (edge > TOP + 1) {
      fill(k, L, TOP, R - L, edge - TOP, k.ink, 0.07);
      line(k, L, TOP, L, edge, { gap: 3, size: 0.9, a: 0.85 });
      line(k, R, TOP, R, edge, { gap: 3, size: 0.9, a: 0.85 });
      zigzag(k, edge, 0.85);
    }

    const shown = (y: number) => edge > y + 4;
    // Title, typed.
    const title = "ANVIONIX LABS";
    const tn = Math.floor(clamp((t - 0.1) / 0.08) * title.length);
    if (shown(60) && tn > 0) text(k, title.slice(0, tn), (L + R) / 2, 60, { size: 15, bold: true, align: "center" });
    if (shown(82)) line(k, L + 16, 82, R - 16, 82, { gap: 3, size: 0.9, a: 0.6, q: clamp((t - 0.18) / 0.05) });

    ROWS.forEach((r, i) => {
      const y = ROW_Y(i);
      const p = clamp((t - 0.22 - i * 0.07) / 0.07);
      if (!shown(y) || p <= 0) return;
      const nn = Math.ceil(clamp(p / 0.5) * r.name.length);
      text(k, r.name.slice(0, nn), L + 16, y, { size: 12.5 });
      if (p > 0.5) {
        const w = fs(k, 12.5) * 0.6;
        const x0 = L + 16 + r.name.length * w + 5;
        const rw = r.result.length * w;
        const x1 = R - 16 - rw - 5;
        line(k, x0, y + 3, x1, y + 3, { gap: 3, size: 0.9, a: 0.6, q: clamp((p - 0.5) / 0.3) });
        if (p > 0.85) text(k, r.result, R - 16, y, { size: 12.5, bold: true, align: "right", color: r.free ? k.accent : k.ink });
      }
    });

    // The stamp thumps down, a little crooked.
    const sp = clamp((t - 0.66) / 0.1);
    if (sp > 0) {
      const g = k.g;
      const sc = lerp(1.7, 1, smooth(sp));
      const ang = (-6 * Math.PI) / 180;
      const cx = (L + R) / 2;
      const cy = 270;
      const size = fs(k, 12.5);
      const w = 17 * size * 0.62 + 14;
      const h = size + 12;
      g.save();
      g.setTransform(k.s * sc * Math.cos(ang), k.s * sc * Math.sin(ang), -k.s * sc * Math.sin(ang), k.s * sc, k.s * cx, k.s * cy);
      g.globalAlpha = smooth(sp) * k.alpha;
      g.strokeStyle = k.accent;
      g.lineWidth = 1.6;
      g.setLineDash([3, 2]);
      g.strokeRect(-w / 2, -h / 2, w, h);
      g.fillStyle = k.accent;
      g.font = `600 ${size}px ${k.font}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("QUOTED IN WRITING", 0, 0.5);
      g.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
    }
  },
};
