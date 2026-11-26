"use client";

import { SceneCanvas } from "./scene-canvas";
import { HERO_SCENES } from "./scenes";

// The home hero figure: short dotted scenes that fade into one another, each with its own caption.
// The player is shared with the other pages (scene-canvas.tsx).
export function HeroScenes({ className = "" }: { className?: string }) {
  return <SceneCanvas scenes={HERO_SCENES} pace="home" captions className={className} />;
}
