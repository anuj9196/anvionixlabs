// Shared drawing kit for the home hero scenes: a 1-bit dotted look on a 2D canvas.
// Everything is drawn in a logical W x H box and snapped to whole device pixels.

export const W = 360;
export const H = 250;

export type Kit = {
  g: CanvasRenderingContext2D;
  s: number; // device pixels per logical unit
  ink: string;
  accent: string;
  accentInk: string; // text on an accent fill
  font: string;
  alpha: number; // the scene's crossfade, multiplied into every draw
};

/** A scene draws itself at progress t (0..1 over its length); ms is the scene's own elapsed time. */
export type Scene = {
  fig: string;
  caption: string;
  hold?: number; // ms on screen before the next scene starts (default: the cycler's)
  draw: (k: Kit, t: number, ms: number) => void;
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
/** Deterministic noise in -0.5..0.5. */
export const rn = (a: number, b = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

type Opts = { gap?: number; size?: number; color?: string; a?: number };

/** One crisp square dot centred on (x, y). */
export function px(k: Kit, x: number, y: number, size: number, color: string, a = 1) {
  const d = Math.max(1, Math.round(k.s * size));
  k.g.globalAlpha = a * k.alpha;
  k.g.fillStyle = color;
  k.g.fillRect(Math.round(x * k.s - d / 2), Math.round(y * k.s - d / 2), d, d);
}

/** A straight line of dots, drawn up to fraction q of its length. Solid when the gap closes up. */
export function line(k: Kit, x1: number, y1: number, x2: number, y2: number, o: Opts & { q?: number } = {}) {
  const { gap = 3, size = 1, color = k.ink, a = 1, q = 1 } = o;
  if (q <= 0) return;
  const ex = x1 + (x2 - x1) * q;
  const ey = y1 + (y2 - y1) * q;
  if (gap <= size * 1.05 && (x1 === x2 || y1 === y2)) {
    const d = Math.max(1, Math.round(k.s * size));
    k.g.globalAlpha = a * k.alpha;
    k.g.fillStyle = color;
    const x = Math.round(Math.min(x1, ex) * k.s - d / 2);
    const y = Math.round(Math.min(y1, ey) * k.s - d / 2);
    k.g.fillRect(x, y, Math.round(Math.abs(ex - x1) * k.s) + d, Math.round(Math.abs(ey - y1) * k.s) + d);
    return;
  }
  const len = Math.hypot(ex - x1, ey - y1);
  const n = Math.max(1, Math.round(len / gap));
  for (let i = 0; i <= n; i++) px(k, lerp(x1, ex, i / n), lerp(y1, ey, i / n), size, color, a);
}

export function rect(k: Kit, x: number, y: number, w: number, h: number, o: Opts = {}) {
  line(k, x, y, x + w, y, o);
  line(k, x + w, y, x + w, y + h, o);
  line(k, x + w, y + h, x, y + h, o);
  line(k, x, y + h, x, y, o);
}

export function fill(k: Kit, x: number, y: number, w: number, h: number, color: string, a = 1) {
  k.g.globalAlpha = a * k.alpha;
  k.g.fillStyle = color;
  k.g.fillRect(Math.round(x * k.s), Math.round(y * k.s), Math.round(w * k.s), Math.round(h * k.s));
}

type TextOpts = { size?: number; color?: string; a?: number; align?: CanvasTextAlign; bold?: boolean; skew?: [number, number] };

/** Mono text at (x, y), middle baseline. skew = [sx, sy] draws it along a slanted face. */
export function text(k: Kit, str: string, x: number, y: number, o: TextOpts = {}) {
  const { size = 10, color = k.ink, a = 1, align = "left", bold = false, skew = [1, 0] } = o;
  const g = k.g;
  g.setTransform(k.s * skew[0], k.s * skew[1], 0, k.s, k.s * x, k.s * y);
  g.globalAlpha = a * k.alpha;
  g.fillStyle = color;
  g.font = `${bold ? "600 " : ""}${size}px ${k.font}`;
  g.textAlign = align;
  g.textBaseline = "middle";
  g.fillText(str, 0, 0);
  g.setTransform(1, 0, 0, 1, 0, 0);
}
