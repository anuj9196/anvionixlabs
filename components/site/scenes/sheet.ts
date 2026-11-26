import { type Scene, W, H } from "./kit";

// Scene 8: the original hero figure, a thin dotted sheet in perspective with tokens rising out of it.

const FAR_Y = 0.68 * H; // the sheet's back edge: tokens are revealed above it, never over dots
const NEAR_Y = 0.94 * H;
const FAR_HALF = 0.34 * W;
const NEAR_HALF = 0.49 * W;
const ROWS = 15;
const COLS = 43;
const TOP_Y = 0.07 * H;
const PERIOD = 9000; // ms for one token to rise and fade
const SIZE = 11;

// A rotating pool of keywords: industries, cloud, technology and a few originals, interleaved so
// the rising tokens always mix groups.
const GROUPS = [
  ["ecommerce", "healthcare", "fintech", "edtech", "logistics", "retail", "saas", "media"],
  ["aws", "gcp", "azure", "cloudflare", "vercel"],
  ["ai", "agentic", "llm", "rag", "react", "next.js", "python", "postgres", "kubernetes"],
  ["git", "api", "ship", "v1"],
];
// A fresh shuffle (Fisher-Yates) each time the scene starts, dealt without repeats until the deck
// is used up. Neighbours in the deck never share a group, so the mix stays even.
const ALL = GROUPS.flatMap((g, gi) => g.map((text) => ({ text, gi })));
let deck: string[] = [];
let lastMs = Infinity;
function shuffle() {
  const d = [...ALL];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  for (let i = 1; i < d.length; i++) {
    if (d[i].gi !== d[i - 1].gi) continue;
    const j = d.findIndex((x, m) => m > i && x.gi !== d[i - 1].gi && (m + 1 >= d.length || x.gi !== d[m + 1].gi));
    if (j > 0) [d[i], d[j]] = [d[j], d[i]];
  }
  deck = d.map((x) => x.text);
}

// Seven lanes, each phase-shifted by a multiple of 1/7 of the rise: two tokens are never within a
// seventh of the travel (about 22 units, more than the line height) of each other vertically, so
// they cannot overlap however wide they are. The outer lanes are inset so "kubernetes" and
// "cloudflare" (about 66 units) stay fully inside the figure.
const LANES = 7;
const LANE_SPAN = 128;
const laneX = (i: number) => W / 2 + ((i / (LANES - 1)) * 2 - 1) * LANE_SPAN;
/** The rise cycle count plus progress 0..1 of a lane's token. */
const phase = (i: number, ms: number) => {
  const v = ms / PERIOD + (i * 3) / LANES;
  return { n: Math.floor(v) * LANES + i, p: v - Math.floor(v) };
};

export const sheet: Scene = {
  fig: "Fig. 008",
  caption: "Ideas, lifting off the page",
  hold: 9600,
  draw(k, _t, ms) {
    if (ms < lastMs || !deck.length) shuffle(); // a new loop: new order
    lastMs = ms;
    const { g, s } = k;
    g.fillStyle = k.ink;
    for (let r = 0; r < ROWS; r++) {
      const t = r / (ROWS - 1);
      const y = FAR_Y + (NEAR_Y - FAR_Y) * Math.pow(t, 1.4);
      const half = FAR_HALF + (NEAR_HALF - FAR_HALF) * t;
      const d = Math.max(1, Math.round(s * (0.8 + 0.9 * t)));
      g.globalAlpha = (0.4 + 0.45 * t) * k.alpha;
      for (let c = 0; c < COLS; c++) {
        const x = W / 2 + (c / (COLS - 1) - 0.5) * 2 * half;
        g.fillRect(Math.round(x * s), Math.round(y * s), d, d);
      }
    }
    // The tokens, clipped to the area above the sheet so no label ever sits on dots.
    g.setTransform(s, 0, 0, s, 0, 0);
    g.save();
    g.beginPath();
    g.rect(0, 0, W, FAR_Y - 3);
    g.clip();
    g.font = `${SIZE}px ${k.font}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (let i = 0; i < LANES; i++) {
      const { n, p } = phase(i, ms + 2500);
      const y = FAR_Y + 4 - (FAR_Y + 4 - TOP_Y) * p;
      // Fade in as it leaves the sheet, then fade out the higher it gets.
      g.globalAlpha = (p < 0.1 ? p / 0.1 : Math.max(0, 1 - Math.pow((p - 0.1) / 0.9, 1.4))) * k.alpha;
      g.fillStyle = n % 4 === 1 ? k.accent : k.ink;
      g.fillText(deck[n % deck.length], Math.round(laneX(i)), Math.round(y));
    }
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
  },
};
