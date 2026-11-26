import { type Scene, clamp, smooth, line, text, px } from "./kit";

// Scene 5: a short terminal types build, tests and deploy checks, then a pulsing orange "live".

const X = 40;
const Y = 46;
const TW = 280;
const TH = 150;
const SIZE = 12;
const CPS = 14; // typing speed, characters per second

// Each line: text, and the second it starts typing.
const LINES: [string, number][] = [
  ["$ ship v1.0", 0.6],
  ["build ✓", 1.5],
  ["tests ✓", 2.1],
  ["deploy ✓", 2.7],
];
const LIVE_AT = 3.4;

export const deploy: Scene = {
  fig: "Fig. 005",
  caption: "Shipped and running",
  draw(k, _t, ms) {
    const sec = ms / 1000;
    const o = { gap: 3, size: 0.9, a: 0.7 };
    line(k, X, Y, X + TW, Y, o);
    line(k, X + TW, Y, X + TW, Y + TH, o);
    line(k, X + TW, Y + TH, X, Y + TH, o);
    line(k, X, Y + TH, X, Y, o);
    line(k, X, Y + 22, X + TW, Y + 22, o);
    for (let i = 0; i < 3; i++) px(k, X + 12 + i * 10, Y + 11, 4, k.ink, 0.55);
    text(k, "~/shipyard", X + 52, Y + 11.5, { size: 8, a: 0.6 });

    const rowY = (i: number) => Y + 44 + i * 22;
    let cursor: [number, number] | null = null;
    LINES.forEach(([str, at], i) => {
      const n = Math.floor(clamp((sec - at) * CPS, 0, str.length));
      if (n <= 0) return;
      const shown = str.slice(0, n);
      // the mark of a passing step glows orange; the rest is plain ink
      const body = shown.endsWith("✓") ? shown.slice(0, -1) : shown;
      text(k, body, X + 14, rowY(i), { size: SIZE, a: i === 0 ? 0.65 : 1 });
      if (shown.endsWith("✓")) text(k, "✓", X + 14 + (body.length) * SIZE * 0.6, rowY(i), { size: SIZE, color: k.accent, bold: true });
      cursor = [X + 14 + n * SIZE * 0.6 + 2, rowY(i)];
    });
    const la = smooth((sec - LIVE_AT) / 0.25);
    if (la > 0) {
      const pulse = 0.7 + 0.3 * Math.sin((sec - LIVE_AT) * 5);
      text(k, "● live", X + 14, rowY(4) + 4, { size: 15, color: k.accent, a: la * pulse, bold: true });
      cursor = null;
    }
    if (cursor && Math.floor(sec * 2.2) % 2 === 0) {
      const [cx, cy] = cursor as [number, number];
      line(k, cx + 2, cy - 6, cx + 2, cy + 6, { gap: 1, size: 1.6, a: 0.8 });
    }
  },
};
