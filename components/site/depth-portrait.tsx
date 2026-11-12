"use client";

import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
// Shift each pixel by its depth: near parts move with the pointer, far parts barely move.
const FRAG = `precision mediump float;varying vec2 uv;uniform sampler2D img;uniform sampler2D depth;uniform vec2 off;uniform float zoom;
void main(){vec2 c=(uv-.5)/zoom+.5;float d=texture2D(depth,c).r;vec2 s=c+off*(d-.45);gl_FragColor=texture2D(img,s);}`;

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

/**
 * A portrait with depth. With a depth map (white = near), WebGL displaces the photo so it
 * turns slightly towards the pointer, the phone's tilt and the scroll. Without one, or when
 * WebGL or motion is unavailable, it falls back to a gentle 3D tilt of the flat photo.
 */
export function DepthPortrait({ src, depthSrc, alt, className = "", priority = false }: { src: string; depthSrc?: string; alt: string; className?: string; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let draw: ((x: number, y: number) => void) | null = null;
    let stopped = false;

    const onPointer = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((ev.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => ((target.x = 0), (target.y = 0));
    const onTilt = (ev: DeviceOrientationEvent) => {
      if (ev.gamma == null || ev.beta == null) return;
      target.x = Math.max(-1, Math.min(1, ev.gamma / 25));
      target.y = Math.max(-1, Math.min(1, (ev.beta - 45) / 25));
    };
    const scrollY = () => {
      const r = el.getBoundingClientRect();
      return Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y + scrollY() * 0.6 - cur.y) * 0.08;
      if (draw) draw(cur.x, cur.y);
      else el.style.transform = `perspective(900px) rotateY(${cur.x * 5}deg) rotateX(${-cur.y * 4}deg)`;
      if (!stopped) raf = requestAnimationFrame(tick);
    };

    (async () => {
      const cv = canvas.current;
      const ctx = depthSrc && cv ? cv.getContext("webgl", { premultipliedAlpha: false }) : null;
      if (ctx && cv && depthSrc) {
        try {
          const [img, dep] = await Promise.all([load(src), load(depthSrc)]);
          if (stopped) return;
          const sh = (type: number, code: string) => {
            const s = ctx.createShader(type)!;
            ctx.shaderSource(s, code);
            ctx.compileShader(s);
            return s;
          };
          const prog = ctx.createProgram()!;
          ctx.attachShader(prog, sh(ctx.VERTEX_SHADER, VERT));
          ctx.attachShader(prog, sh(ctx.FRAGMENT_SHADER, FRAG));
          ctx.linkProgram(prog);
          ctx.useProgram(prog);
          ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
          ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
          const loc = ctx.getAttribLocation(prog, "p");
          ctx.enableVertexAttribArray(loc);
          ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
          [img, dep].forEach((im, i) => {
            ctx.activeTexture(ctx.TEXTURE0 + i);
            ctx.bindTexture(ctx.TEXTURE_2D, ctx.createTexture());
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, im);
          });
          ctx.uniform1i(ctx.getUniformLocation(prog, "img"), 0);
          ctx.uniform1i(ctx.getUniformLocation(prog, "depth"), 1);
          ctx.uniform1f(ctx.getUniformLocation(prog, "zoom"), 1.06);
          const off = ctx.getUniformLocation(prog, "off");
          const size = () => {
            const dpr = Math.min(devicePixelRatio, 2);
            cv.width = cv.clientWidth * dpr;
            cv.height = cv.clientHeight * dpr;
            ctx.viewport(0, 0, cv.width, cv.height);
          };
          size();
          window.addEventListener("resize", size);
          draw = (x, y) => {
            ctx.uniform2f(off, x * 0.035, y * 0.03);
            ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
          };
          setGl(true);
        } catch {
          draw = null;
        }
      }
      raf = requestAnimationFrame(tick);
    })();

    el.addEventListener("pointermove", onPointer);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [src, depthSrc]);

  return (
    <div ref={box} className={`relative overflow-hidden will-change-transform ${className}`}>
      {/* The photo itself is always in the page, for search, sharing and no-JS visitors. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} fetchPriority={priority ? "high" : undefined} decoding="async" className={`h-full w-full object-cover ${gl ? "invisible" : ""}`} />
      {depthSrc && <canvas ref={canvas} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${gl ? "opacity-100" : "opacity-0"}`} />}
    </div>
  );
}
