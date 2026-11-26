import { type Scene, clamp, lerp, smooth, line, px } from "./kit";

// An open book, pages up in a V, lines of text writing themselves across both pages; one orange line and a ribbon.

type P = [number, number];
// Left page corners (spine top, outer top, outer bottom, spine bottom); the right page mirrors it.
const LEFT: P[] = [[180, 82], [58, 52], [58, 164], [180, 200]];
const mirror = (p: P): P => [360 - p[0], p[1]];
const RIGHT = LEFT.map(mirror);

/** A point on a page: u runs outer edge (0) to spine (1), v runs top (0) to bottom (1). */
function at(c: P[], u: number, v: number): P {
  const [st, ot, ob, sb] = c;
  const top: P = [lerp(ot[0], st[0], u), lerp(ot[1], st[1], u)];
  const bot: P = [lerp(ob[0], sb[0], u), lerp(ob[1], sb[1], u)];
  return [lerp(top[0], bot[0], v), lerp(top[1], bot[1], v)];
}
function edge(k: Parameters<typeof line>[0], c: P[], q: number, dy = 0, a = 0.9) {
  const pts = [c[0], c[1], c[2], c[3], c[0]];
  const total = 4;
  pts.slice(1).forEach((p, i) => {
    const qq = clamp(q * total - i);
    if (qq > 0) line(k, pts[i][0], pts[i][1] + dy, p[0], p[1] + dy, { gap: 2.4, size: 0.9, a, q: qq });
  });
}

const ROWS = 8;
const LENS = [0.8, 0.95, 0.9, 0.7, 0.95, 0.85, 0.92, 0.55];

export const book: Scene = {
  fig: "Fig. 010",
  caption: "Where it started",
  draw(k, t) {
    const pq = clamp((t - 0.02) / 0.2);
    // A second, lower outline for the thickness of the pages.
    edge(k, LEFT, pq, 6, 0.4);
    edge(k, RIGHT, pq, 6, 0.4);
    edge(k, LEFT, pq);
    edge(k, RIGHT, pq);
    line(k, 180, 82, 180, 206, { gap: 2.4, size: 0.9, q: pq });
    // Lines of text, left page first, then the right.
    [LEFT, RIGHT].forEach((c, pi) => {
      for (let i = 0; i < ROWS; i++) {
        const idx = pi * ROWS + i;
        const q = clamp((t - 0.22 - idx * 0.032) / 0.05);
        if (q <= 0) continue;
        const v = 0.14 + i * 0.1;
        const len = LENS[(i + pi * 3) % LENS.length];
        const heading = i === 0 && pi === 0;
        const a = at(c, 0.14, v);
        const b = at(c, 0.14 + 0.72 * (heading ? 0.5 : len), v);
        const orange = pi === 1 && i === 3;
        line(k, a[0], a[1], b[0], b[1], { gap: heading ? 1.2 : 2.6, size: heading ? 1.5 : 0.9, a: heading ? 1 : 0.7, color: orange ? k.accent : k.ink, q });
      }
    });
    // The ribbon marking the place.
    const rq = clamp((t - 0.78) / 0.1);
    if (rq > 0) {
      const y1 = 200 + 24 * smooth(rq);
      line(k, 174, 200, 174, y1, { gap: 1, size: 1.2, color: k.accent });
      line(k, 180, 200, 180, y1, { gap: 1, size: 1.2, color: k.accent });
      line(k, 174, y1, 177, y1 - 5, { gap: 1, size: 1.2, color: k.accent });
      line(k, 180, y1, 177, y1 - 5, { gap: 1, size: 1.2, color: k.accent });
      px(k, 177, y1 - 9, 2, k.accent);
    }
  },
};
