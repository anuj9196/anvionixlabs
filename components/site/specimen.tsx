import { SceneCanvas } from "./scene-canvas";
import type { SceneId } from "./scenes";

/** A specimen card: dotted scenes playing in a framed panel, labelled like a figure in the notebook. */
export function Specimen({ scenes, no, name, caption, className = "" }: { scenes: SceneId[]; no: string; name: string; caption: string; className?: string }) {
  return (
    <figure aria-hidden className={`relative w-full ${className}`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-rule bg-sheet">
        <div className="absolute inset-x-5 bottom-11 top-11">
          <SceneCanvas scenes={scenes} className="h-full" />
        </div>
        <div className="absolute inset-x-5 top-4 flex justify-between gap-4 label">
          <span>Specimen · {no}</span>
          <span className="truncate">{name}</span>
        </div>
        <div className="absolute inset-x-5 bottom-4 flex justify-between gap-4 label">
          <span>Fig. {Number(no)}</span>
          <span className="truncate text-right">{caption}</span>
        </div>
      </div>
    </figure>
  );
}
