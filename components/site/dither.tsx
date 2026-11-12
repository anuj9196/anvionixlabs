"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyShape } from "@/data/site";

const SHAPES: JourneyShape[] = ["book", "terminal", "servers", "network", "trophy", "notebook"];
// Rendered small and scaled up with crisp pixels: cheap, and it is the look.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Ray-marched signed-distance shapes, lit, then reduced to two colours with a 4x4 Bayer matrix.
const FRAG = `precision highp float;
uniform vec2 res;uniform float time;uniform float t;uniform float a;uniform float b;uniform vec3 ink;uniform vec3 paper;
mat2 rot(float r){float c=cos(r),s=sin(r);return mat2(c,-s,s,c);}
float box(vec3 p,vec3 s){vec3 q=abs(p)-s;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float rbox(vec3 p,vec3 s,float r){return box(p,s-r)-r;}
float cyl(vec3 p,float h,float r){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
float tor(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float cap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float book(vec3 p){vec3 l=p-vec3(-.42,0,0);l.xy*=rot(-.28);vec3 r=p-vec3(.42,0,0);r.xy*=rot(.28);
  float pages=min(rbox(l,vec3(.44,.05,.62),.02),rbox(r,vec3(.44,.05,.62),.02));return min(pages,cyl(vec3(p.x,p.z,p.y+.1),.62,.05));}
float terminal(vec3 p){float m=rbox(p-vec3(0,.18,0),vec3(.8,.52,.08),.04);float scr=box(p-vec3(0,.2,.09),vec3(.68,.4,.04));
  m=max(m,-scr);float st=cyl(p-vec3(0,-.5,0),.18,.07);float base=rbox(p-vec3(0,-.7,0),vec3(.38,.03,.22),.02);return min(m,min(st,base));}
float servers(vec3 p){float d=1e9;for(int i=0;i<3;i++){float y=float(i)*.46-.46;vec3 q=p-vec3(0,y,0);
  float u=rbox(q,vec3(.72,.17,.48),.04);u=max(u,-box(q-vec3(.3,0,.48),vec3(.25,.05,.03)));d=min(d,u);}return d;}
float network(vec3 p){vec3 v0=vec3(0,.62,0),v1=vec3(.6,-.3,.35),v2=vec3(-.6,-.3,.35),v3=vec3(0,-.3,-.65);
  float d=min(min(length(p-v0),length(p-v1)),min(length(p-v2),length(p-v3)))-.17;
  d=min(d,min(cap(p,v0,v1,.035),cap(p,v0,v2,.035)));d=min(d,min(cap(p,v0,v3,.035),cap(p,v1,v2,.035)));
  return min(d,min(cap(p,v1,v3,.035),cap(p,v2,v3,.035)));}
float trophy(vec3 p){vec3 q=p-vec3(0,.3,0);float r=mix(.18,.48,clamp((q.y+.35)/.7,0.,1.));
  float cup=max(length(q.xz)-r,abs(q.y)-.35);cup=max(cup,-(max(length(q.xz)-(r-.06),abs(q.y-.08)-.35)));
  float hd=tor(vec3(abs(q.x)-.5,q.z,q.y),vec2(.16,.035));
  float stem=cyl(p-vec3(0,-.25,0),.2,.06);float base=rbox(p-vec3(0,-.55,0),vec3(.32,.09,.32),.03);return min(min(cup,hd),min(stem,base));}
float notebook(vec3 p){float c=rbox(p,vec3(.62,.82,.07),.03);float d=c;for(int i=0;i<6;i++){float y=float(i)*.3-.75;
  d=min(d,tor(p-vec3(-.62,y,0),vec2(.1,.022)));}return d;}
float shape(float i,vec3 p){if(i<.5)return book(p);if(i<1.5)return terminal(p);if(i<2.5)return servers(p);
  if(i<3.5)return network(p);if(i<4.5)return trophy(p);return notebook(p);}
float map(vec3 p){p.xz*=rot(time*.35);p.yz*=rot(-.32);return mix(shape(a,p),shape(b,p),t);}
float bayer2(vec2 v){v=floor(v);return fract(v.x/2.+v.y*v.y*.75);}
float bayer4(vec2 v){return bayer2(.5*v)*.25+bayer2(v);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec3 ro=vec3(0,0,3.2),rd=normalize(vec3(uv,-1.6));
  float d=0.;float hit=0.;for(int i=0;i<72;i++){float s=map(ro+rd*d);if(s<.002){hit=1.;break;}d+=s*.85;if(d>6.)break;}
  float lum=0.;if(hit>.5){vec3 pos=ro+rd*d;vec2 e=vec2(.002,0);
    vec3 n=normalize(vec3(map(pos+e.xyy)-map(pos-e.xyy),map(pos+e.yxy)-map(pos-e.yxy),map(pos+e.yyx)-map(pos-e.yyx)));
    vec3 l=normalize(vec3(-.5,.8,.6));lum=.12+.78*max(dot(n,l),0.)+.25*pow(1.-max(dot(n,-rd),0.),2.);}
  float on=step(bayer4(gl_FragCoord.xy)+.03,lum);gl_FragColor=vec4(mix(paper,ink,on),1.);}`;

function rgb(css: string): [number, number, number] {
  const el = document.createElement("span");
  el.style.color = css;
  document.body.appendChild(el);
  const m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"];
  el.remove();
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
}

/** A 1-bit dithered 3D object. Changing `shape` morphs it; it turns slowly while on screen. */
export function DitherObject({ shape, res: RES = 168, className = "" }: { shape: JourneyShape; res?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef(SHAPES.indexOf(shape));
  const [ok, setOk] = useState(true);
  target.current = SHAPES.indexOf(shape);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    // Start only after the page has loaded and gone idle, so the shader never competes with first paint.
    const boot = () => {
      if (cancelled) return;
      cleanup = setup() ?? (() => {});
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
    const gl = cv.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });
    if (!gl) {
      setOk(false);
      return;
    }
    const sh = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setOk(false);
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    cv.width = RES;
    cv.height = RES;
    gl.viewport(0, 0, RES, RES);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform2f(u("res"), RES, RES);
    const colors = () => {
      const s = getComputedStyle(document.documentElement);
      gl.uniform3fv(u("ink"), rgb(s.getPropertyValue("--ink")));
      gl.uniform3fv(u("paper"), rgb(s.getPropertyValue("--sheet")));
    };
    colors();
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", colors);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let from = target.current;
    let to = target.current;
    let morphStart = 0;
    let visible = true;
    let raf = 0;
    const start = performance.now();
    let last = 0;
    const frame = (now: number) => {
      if (now - last < 32 && target.current === to) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      if (target.current !== to) {
        from = to;
        to = target.current;
        morphStart = now;
      }
      const k = still ? 1 : Math.min(1, (now - morphStart) / 900);
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      gl.uniform1f(u("a"), from);
      gl.uniform1f(u("b"), to);
      gl.uniform1f(u("t"), eased);
      gl.uniform1f(u("time"), still ? 0.6 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && (!still || k < 1 || target.current !== to)) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    const wake = () => {
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("journey-step", wake);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      scheme.removeEventListener("change", colors);
      window.removeEventListener("journey-step", wake);
    };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ok) return null;
  return <canvas ref={canvas} aria-hidden className={`aspect-square w-full [image-rendering:pixelated] ${className}`} />;
}

