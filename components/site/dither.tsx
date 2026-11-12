"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyShape } from "@/data/site";

// Order matters: the shader picks a shape by its index here.
const SHAPES: JourneyShape[] = [
  "book", "terminal", "servers", "network", "trophy", "notebook",
  "browser", "phone", "lens", "qr", "battery", "form", "timer", "cube",
];
// Rendered small and scaled up with crisp pixels: cheap, and it is the look.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Ray-marched signed-distance shapes, lit, then reduced to two colours with a 4x4 Bayer matrix.
const FRAG = `precision highp float;
uniform vec2 res;uniform float time;uniform float t;uniform float a;uniform float b;uniform vec3 ink;uniform vec3 paper;uniform float rock;
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
float browser(vec3 p){float f=rbox(p,vec3(.86,.62,.06),.04);f=max(f,-box(p-vec3(0,-.07,.07),vec3(.76,.46,.04)));
  float d=f;for(int i=0;i<3;i++){d=min(d,length(p-vec3(-.72+float(i)*.12,.5,.06))-.035);}
  d=min(d,rbox(p-vec3(-.3,.12,.02),vec3(.36,.2,.03),.02));d=min(d,rbox(p-vec3(.42,.12,.02),vec3(.24,.2,.03),.02));
  return min(d,rbox(p-vec3(0,-.33,.02),vec3(.66,.1,.03),.02));}
float phone(vec3 p){float b=rbox(p,vec3(.42,.84,.06),.1);b=max(b,-box(p-vec3(0,0,.07),vec3(.35,.7,.03)));
  b=min(b,length(p-vec3(0,.77,.05))-.03);b=min(b,rbox(p-vec3(.44,.3,0),vec3(.02,.12,.03),.01));
  for(int i=0;i<3;i++){b=min(b,rbox(p-vec3(0,.4-float(i)*.32,.04),vec3(.27,.11,.02),.02));}return b;}
float lens(vec3 p){vec3 q=p-vec3(-.18,.2,0);float r=tor(vec3(q.x,q.z,q.y),vec2(.42,.07));
  float g=cyl(vec3(q.x,q.z,q.y),.015,.4);return min(min(r,g),cap(p,vec3(.14,-.12,0),vec3(.62,-.62,0),.09));}
float qr(vec3 p){float d=rbox(p,vec3(.78,.78,.04),.02);
  for(int i=0;i<3;i++){vec2 c=i==0?vec2(-.47,.47):i==1?vec2(.47,.47):vec2(-.47,-.47);vec3 q=p-vec3(c,.06);
    float f=max(box(q,vec3(.24,.24,.04)),-box(q,vec3(.16,.16,.1)));d=min(d,min(f,box(q,vec3(.08,.08,.04))));}
  vec3 m=p-vec3(0,0,.06);d=min(d,box(m-vec3(.1,.05,0),vec3(.08,.2,.04)));d=min(d,box(m-vec3(.42,-.2,0),vec3(.2,.08,.04)));
  d=min(d,box(m-vec3(-.1,-.48,0),vec3(.2,.08,.04)));d=min(d,box(m-vec3(.5,-.52,0),vec3(.08,.08,.04)));
  return min(d,box(m-vec3(.16,.5,0),vec3(.08,.12,.04)));}
float battery(vec3 p){float b=cyl(p,.66,.34)-.03;b=min(b,cyl(p-vec3(0,.74,0),.08,.13)-.02);
  b=min(b,tor(p-vec3(0,.22,0),vec2(.36,.03)));b=min(b,tor(p-vec3(0,-.45,0),vec2(.36,.03)));
  vec3 q=p-vec3(0,-.1,.36);return min(b,min(box(q,vec3(.13,.03,.04)),box(q,vec3(.03,.13,.04))));}
float form(vec3 p){float d=rbox(p,vec3(.62,.82,.04),.03);
  for(int i=0;i<3;i++){d=min(d,rbox(p-vec3(.05,.48-float(i)*.3,.05),vec3(.44,.08,.03),.03));
    d=min(d,box(p-vec3(-.42,.48-float(i)*.3,.05),vec3(.06,.06,.03)));}
  return min(d,rbox(p-vec3(-.26,-.55,.06),vec3(.24,.1,.04),.08));}
float timer(vec3 p){vec3 z=vec3(p.x,p.z,p.y);float b=cyl(z,.1,.56)-.03;b=max(b,-cyl(z-vec3(0,.12,0),.04,.48));
  b=min(b,tor(vec3(p.x,p.z-.1,p.y),vec2(.5,.04)));b=min(b,cyl(p-vec3(0,.68,0),.08,.08));b=min(b,cyl(p-vec3(0,.8,0),.04,.16));
  b=min(b,cap(p,vec3(0,0,.09),vec3(0,.36,.09),.035));b=min(b,cap(p,vec3(0,0,.09),vec3(.24,-.1,.09),.035));
  return min(b,length(p-vec3(0,0,.1))-.06);}
float cube(vec3 p){vec3 b=vec3(.6),q=abs(p)-b,w=abs(q+.04)-.04;
  float f=min(min(length(max(vec3(q.x,w.y,w.z),0.))+min(max(q.x,max(w.y,w.z)),0.),
    length(max(vec3(w.x,q.y,w.z),0.))+min(max(w.x,max(q.y,w.z)),0.)),length(max(vec3(w.x,w.y,q.z),0.))+min(max(w.x,max(w.y,q.z)),0.));
  vec3 r=p;r.xy*=rot(.6);r.yz*=rot(.6);return min(f,rbox(r,vec3(.24),.04));}
float shape(float i,vec3 p){if(i<.5)return book(p);if(i<1.5)return terminal(p);if(i<2.5)return servers(p);
  if(i<3.5)return network(p);if(i<4.5)return trophy(p);if(i<5.5)return notebook(p);if(i<6.5)return browser(p);
  if(i<7.5)return phone(p);if(i<8.5)return lens(p);if(i<9.5)return qr(p);if(i<10.5)return battery(p);
  if(i<11.5)return form(p);if(i<12.5)return timer(p);return cube(p);}
float map(vec3 p){p.xz*=rot(rock>.5?sin(time*.45)*.42+.12:time*.35);p.yz*=rot(-.32);if(t>.999)return shape(b,p);return mix(shape(a,p),shape(b,p),t);}
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
/** Flat objects read as slivers edge-on, so they rock to and fro facing the viewer instead of turning all the way. */
const FLAT = new Set<JourneyShape>(["browser", "phone", "lens", "qr", "form", "timer"]);

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
    gl.uniform1f(u("rock"), FLAT.has(SHAPES[target.current]) ? 1 : 0);
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

