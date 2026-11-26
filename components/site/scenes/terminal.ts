import { type Scene, clamp, smooth, line, text, px, fs } from "./kit";

// A terminal types one short command (a first commit) and prints the reply, then waits at a blinking prompt.

const X = 40;
const Y = 46;
const TW = 280;
const TH = 150;
const SIZE = 12;
const CPS = 14;
const CMD = "$ git commit -m first";

export const terminal: Scene = {
  fig: "Fig. 011",
  caption: "First production code",
  draw(k, _t, ms) {
    const sec = ms / 1000;
    const o = { gap: 3, size: 0.9, a: 0.7 };
    line(k, X, Y, X + TW, Y, o);
    line(k, X + TW, Y, X + TW, Y + TH, o);
    line(k, X + TW, Y + TH, X, Y + TH, o);
    line(k, X, Y + TH, X, Y, o);
    line(k, X, Y + 22, X + TW, Y + 22, o);
    for (let i = 0; i < 3; i++) px(k, X + 12 + i * 10, Y + 11, 4, k.ink, 0.55);
    text(k, "~/first-project", X + 52, Y + 11.5, { size: 8, a: 0.6 });

    const cw = fs(k, SIZE) * 0.6;
    const y0 = Y + 46;
    const n = Math.floor(clamp((sec - 0.6) * CPS, 0, CMD.length));
    let cursor: [number, number] = [X + 14, y0];
    if (n > 0) {
      text(k, CMD.slice(0, n), X + 14, y0, { size: SIZE });
      cursor = [X + 14 + n * cw, y0];
    }
    const oa = smooth((sec - 2.4) / 0.2);
    if (oa > 0) {
      text(k, "[main ", X + 14, y0 + 26, { size: SIZE, a: 0.75 * oa });
      text(k, "1a2b3c4", X + 14 + 6 * cw, y0 + 26, { size: SIZE, color: k.accent, a: oa, bold: true });
      text(k, "] first", X + 14 + 13 * cw, y0 + 26, { size: SIZE, a: 0.75 * oa });
      text(k, "1 file changed", X + 14, y0 + 48, { size: SIZE - 2, a: 0.5 * oa });
    }
    if (sec > 3.2) {
      text(k, "$", X + 14, y0 + 74, { size: SIZE });
      cursor = [X + 14 + 2 * cw, y0 + 74];
    }
    const typing = n < CMD.length;
    const waiting = sec > 3.2;
    if (typing || waiting || sec < 0.6) {
      if (Math.floor(sec * 2.2) % 2 === 0 || typing) line(k, cursor[0] + 1, cursor[1] - 6, cursor[0] + 1, cursor[1] + 6, { gap: 1, size: 1.6, a: 0.85 });
    }
  },
};
