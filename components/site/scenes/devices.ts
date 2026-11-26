import { type Kit, type Scene, clamp, smooth, line, rect, text, px } from "./kit";

// Scene 6: phone, laptop and server rack in the dotted style, linked by lines with data pulses (some orange).

type Pt = [number, number];
const MID = 130;
const PHONE_X = 55;
const WEB_X = 180;
const API_X = 305;

// Three links: app to web, web to api, and app to api over the top.
const LINKS: { pts: Pt[]; at: number; orange: boolean }[] = [
  { pts: [[78, MID], [130, MID]], at: 0.3, orange: false },
  { pts: [[230, MID], [280, MID]], at: 0.36, orange: false },
  { pts: [[PHONE_X, 88], [PHONE_X, 52], [API_X, 52], [API_X, 82]], at: 0.42, orange: true },
];

function along(pts: Pt[], d: number): Pt {
  for (let i = 1; i < pts.length; i++) {
    const len = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= len || i === pts.length - 1) {
      const r = clamp(d / len);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r];
    }
    d -= len;
  }
  return pts[0];
}
const length = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

function device(k: Kit, a: number, kind: "phone" | "laptop" | "server") {
  const o = { gap: 2.4, size: 0.9, a };
  const soft = { gap: 3.4, size: 0.8, a: 0.5 * a };
  if (kind === "phone") {
    rect(k, 32, 88, 46, 84, o);
    line(k, 48, 94, 62, 94, soft);
    for (const y of [108, 126, 144]) rect(k, 38, y, 34, 14, soft);
    line(k, 46, 162, 64, 162, { ...soft, a: a * 0.8 });
  } else if (kind === "laptop") {
    rect(k, 130, 98, 100, 62, o);
    line(k, 118, 170, 242, 170, o);
    line(k, 130, 160, 118, 170, o);
    line(k, 230, 160, 242, 170, o);
    rect(k, 140, 108, 80, 8, soft);
    for (const y of [124, 134, 144]) line(k, 140, y, 140 + (y === 134 ? 60 : 78), y, soft);
  } else {
    rect(k, 280, 82, 50, 90, o);
    for (let i = 0; i < 3; i++) {
      const y = 82 + i * 30;
      if (i) line(k, 280, y, 330, y, o);
      line(k, 288, y + 15, 312, y + 15, soft);
      px(k, 321, y + 15, 3.4, i === 0 ? k.accent : k.ink, a * (i === 0 ? 1 : 0.6));
    }
  }
}

export const devices: Scene = {
  fig: "Fig. 006",
  caption: "One product, every screen",
  draw(k, t, ms) {
    (["phone", "laptop", "server"] as const).forEach((kind, i) => device(k, smooth((t - i * 0.08) / 0.16), kind));
    LINKS.forEach(({ pts, at, orange }, li) => {
      const q = clamp((t - at) / 0.14);
      if (q <= 0) return;
      const total = length(pts);
      pts.slice(1).forEach((p, i) => {
        const [a, b] = [pts[i], p];
        line(k, a[0], a[1], b[0], b[1], { gap: 3.4, size: 0.8, a: 0.55, q });
      });
      if (q < 1 || t < 0.5) return;
      // Pulses: two per link, travelling back and forth, with a short dotted tail.
      for (let n = 0; n < 2; n++) {
        const ph = ((ms / 1700 + n / 2 + li * 0.27) % 1);
        const fwd = Math.floor(ms / 1700 + n / 2 + li * 0.27) % 2 === 0;
        const col = orange || (li === 1 && n === 1) ? k.accent : k.ink;
        for (let s = 0; s < 4; s++) {
          const d = clamp(ph - s * 0.025) * total;
          const [x, y] = along(fwd ? pts : [...pts].reverse(), d);
          px(k, x, y, s ? 2 : 4.2, col, s ? 0.5 - s * 0.1 : 1);
        }
      }
    });
    const la = smooth((t - 0.3) / 0.12);
    if (la > 0) {
      text(k, "app", PHONE_X, 192, { size: 11, bold: true, a: la, align: "center" });
      text(k, "web", WEB_X, 192, { size: 11, bold: true, a: la, align: "center" });
      text(k, "api", API_X, 192, { size: 11, bold: true, a: la, align: "center", color: k.ink });
    }
  },
};
