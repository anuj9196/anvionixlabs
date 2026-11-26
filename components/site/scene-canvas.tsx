"use client";

import { useEffect, useRef } from "react";
import { SCENE_BY_ID, W, H, type SceneId } from "./scenes";
import { type Kit, clamp, smooth } from "./scenes/kit";

// The dotted 2D scenes as a reusable figure. One canvas plays a scene on a loop, cycles several with a
// crossfade, or (with `active`) shows whichever scene the page asks for and crossfades when it changes.
// Scenes draw in a W x H design space and are letterboxed to the canvas. Every canvas shares one
// requestAnimationFrame loop (~30fps) that only runs while some canvas is on screen; each starts after
// the page has loaded, and is a still, finished frame on small screens and with reduced motion.

// Timing. A scene draws itself over `build` ms (its progress t runs 0..1), then holds the finished frame
// (with only idle motion) until `hold`, when the next scene crossfades in. Three paces:
//  - "home":   the hero's original rhythm, 4.6s per scene, progress stretched over the whole slot;
//  - "steady": every other cycling or looping canvas: 4.2s to draw, finished frame held until 7.5s;
//  - controlled (`active`): 2s to draw, then held for as long as the step stays active, 400ms crossfade.
// A scene can override its own `build` / `hold` (scenes/kit.ts).
const HOLD = 4600; // home: ms from one scene's start to the next
const FADE = 800; // ms crossfade
const STEADY_BUILD = 4200;
const STEADY_HOLD = 7500;
const LIVE_BUILD = 2000;
const LIVE_FADE = 400;

/** A scene's visibility at local time u: fades in over the first `fade`, out over the last `fade`. */
function visibility(u: number, hold: number, fade = FADE) {
  if (u < 0 || u >= hold + fade) return 0;
  const k_in = clamp(u / fade);
  const k_out = clamp((u - hold) / fade);
  // The incoming scene waits a beat so the two never sit at half strength on top of each other.
  return smooth((k_in - 0.3) / 0.7) * (1 - smooth(k_out / 0.7));
}

// One shared ticker for every canvas on the page.
type Inst = { visible: boolean; tick: (dt: number) => void };
const insts = new Set<Inst>();
let raf = 0;
let last = 0;
function loop(now: number) {
  raf = 0;
  const dt = last ? Math.min(now - last, 100) : 0;
  if (dt >= 32 || !last) {
    last = now;
    insts.forEach((i) => i.visible && i.tick(dt));
  }
  wake();
}
function wake() {
  if (raf) return;
  let any = false;
  insts.forEach((i) => (any ||= i.visible));
  if (any) raf = requestAnimationFrame(loop);
  else last = 0;
}

type Layer = { i: number; start: number; out: number | null };

export function SceneCanvas({
  scenes,
  active,
  pace = "steady",
  minText = 0,
  tone = "page",
  captions = false,
  design = [W, H],
  className = "",
}: {
  scenes: readonly SceneId[];
  /** Controlled: show scenes[active], crossfading when it changes. Without it the scenes play on their own. */
  active?: number;
  /** "home" keeps the hero's original timing; the default gives every scene time to finish drawing and hold. */
  pace?: "home" | "steady";
  /** Smallest text in CSS pixels; small canvases lift tiny labels to this. */
  minText?: number;
  /** "page" draws in the page ink; "self" in the element's own text colour (for coloured cards). */
  tone?: "page" | "self";
  /** Show each scene's figure number and caption under the canvas. */
  captions?: boolean;
  /** The design space the scenes are drawn for; taller than the default for a scene that wants more height. */
  design?: readonly [number, number];
  /** "fill" fills the parent and letterboxes; the default keeps the design aspect ratio at full width. */
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const caps = useRef<(HTMLSpanElement | null)[]>([]);
  const want = useRef(active);
  const poke = useRef<() => void>(() => {});
  const list = scenes.map((id) => SCENE_BY_ID[id]);
  const key = scenes.join();
  const [DW, DH] = design;

  useEffect(() => {
    want.current = active;
    poke.current();
  }, [active]);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const boot = () => {
      if (!cancelled) cleanup = setup() ?? (() => {});
    };
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(boot, { timeout: 2500 }) : setTimeout(boot, 1200));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      cleanup();
    };

    function setup(): (() => void) | void {
      const cv = canvas.current!;
      const g = cv.getContext("2d");
      if (!g) return;
      const controlled = want.current !== undefined;
      const home = pace === "home";
      const builds = list.map((s) => s.build ?? (controlled ? LIVE_BUILD : STEADY_BUILD));
      const holds = list.map((s, i) => s.hold ?? (home ? HOLD : Math.max(STEADY_HOLD, builds[i] + 3000)));
      // Progress t of a scene u ms after it started.
      const progress = (i: number, u: number) => clamp(u / (home && !controlled ? holds[i] + FADE : builds[i]));
      const starts = holds.map((_, i) => holds.slice(0, i).reduce((a, b) => a + b, 0));
      // A lone scene loops: it fades out at its end and straight back in.
      const cycle = list.length === 1 ? holds[0] + FADE : holds.reduce((a, b) => a + b, 0);
      const kit: Kit = { g, s: 1, ink: "#202124", accent: "#c56a3a", accentInk: "#ffffff", font: "monospace", alpha: 1, tmin: 0 };
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const css = Math.min(cv.clientWidth / DW, cv.clientHeight / DH) || 1;
        kit.s = css * dpr;
        kit.tmin = minText / css;
        cv.width = Math.max(1, Math.round(DW * kit.s));
        cv.height = Math.max(1, Math.round(DH * kit.s));
      };
      fit();
      const colors = () => {
        const cs = getComputedStyle(document.documentElement);
        kit.ink = tone === "self" ? getComputedStyle(cv).color : cs.getPropertyValue("--ink").trim() || kit.ink;
        kit.accent = cs.getPropertyValue("--accent").trim() || kit.accent;
        kit.accentInk = cs.getPropertyValue("--accent-ink").trim() || kit.accentInk;
        kit.font = `${cs.getPropertyValue("--font-mono").trim() || "ui-monospace"}, monospace`;
      };
      colors();
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const small = window.matchMedia("(max-width: 767px)");
      const showCaptions = (a: number[]) => caps.current.forEach((el, i) => el && (el.style.opacity = String(a[i] ?? 0)));

      let clock = 0; // animation time: only counts while on screen
      const layers: Layer[] = controlled ? [{ i: clamp(want.current ?? 0, 0, list.length - 1), start: 0, out: null }] : [];

      const drawStill = () => {
        const i = controlled ? clamp(want.current ?? 0, 0, list.length - 1) : 0;
        kit.alpha = 1;
        list[i].draw(kit, 1, holds[i]);
        g.globalAlpha = 1;
        showCaptions(list.map((_, j) => (j === i ? 1 : 0)));
      };
      const drawLive = () => {
        let alphas: number[];
        if (controlled) {
          const w = clamp(want.current ?? 0, 0, list.length - 1);
          const top = layers[layers.length - 1];
          if (top.i !== w || top.out !== null) {
            layers.forEach((l) => (l.out ??= clock));
            layers.push({ i: w, start: clock, out: null });
          }
          alphas = list.map(() => 0);
          for (let n = layers.length - 1; n >= 0; n--) {
            const l = layers[n];
            const u = clock - l.start;
            const a = smooth((clamp(u / LIVE_FADE) - 0.3) / 0.7) * (l.out === null ? 1 : 1 - smooth((clock - l.out) / LIVE_FADE / 0.7));
            if (l.out !== null && a <= 0.003) {
              layers.splice(n, 1);
              continue;
            }
            if (a > 0.003) {
              kit.alpha = a;
              list[l.i].draw(kit, progress(l.i, u), u);
            }
            alphas[l.i] = Math.max(alphas[l.i], a);
          }
        } else {
          alphas = list.map((scene, i) => {
            const raw = clock - starts[i];
            const u = raw < 0 ? -1 : raw % cycle;
            const a = visibility(u, holds[i]);
            if (a > 0.003) {
              kit.alpha = a;
              scene.draw(kit, progress(i, u), u);
            }
            return a;
          });
        }
        g.globalAlpha = 1;
        showCaptions(alphas);
      };
      const draw = () => {
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, cv.width, cv.height);
        if (reduced.matches || small.matches) drawStill();
        else drawLive();
      };

      const inst: Inst = {
        visible: true,
        tick: (dt) => {
          clock += dt;
          draw();
        },
      };
      const run = () => {
        draw();
        if (!(reduced.matches || small.matches)) wake();
      };
      poke.current = run;
      const recolor = () => {
        colors();
        run();
      };
      const ro = new ResizeObserver(() => {
        fit();
        run();
      });
      ro.observe(cv);
      const io = new IntersectionObserver(([e]) => {
        inst.visible = e.isIntersecting;
        wake();
      });
      io.observe(cv);
      scheme.addEventListener("change", recolor);
      reduced.addEventListener("change", run);
      small.addEventListener("change", run);
      insts.add(inst);
      run();
      return () => {
        poke.current = () => {};
        insts.delete(inst);
        io.disconnect();
        ro.disconnect();
        scheme.removeEventListener("change", recolor);
        reduced.removeEventListener("change", run);
        small.removeEventListener("change", run);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, minText, tone, DW, DH]);

  const fill = className.includes("h-full");
  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden
        className={`block w-full ${fill ? "object-contain" : ""} ${className}`}
        style={fill ? undefined : { aspectRatio: `${DW} / ${DH}` }}
      />
      {captions && (
        <figcaption className="mt-1 grid font-mono text-[11px] text-ink-3">
          {list.map((s, i) => (
            <span
              key={s.fig}
              ref={(el) => {
                caps.current[i] = el;
              }}
              className="col-start-1 row-start-1 flex justify-between"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <span>{s.fig}</span>
              <span>{s.caption}</span>
            </span>
          ))}
        </figcaption>
      )}
    </>
  );
}
