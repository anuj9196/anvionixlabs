import type { JourneyShape } from "@/data/site";
import { DitherObject } from "./dither";

/** A specimen card: one dithered object turning slowly, labelled like a figure in the notebook. */
export function Specimen({ shape, no, name, caption, className = "" }: { shape: JourneyShape; no: string; name: string; caption: string; className?: string }) {
  return (
    <figure aria-hidden className={`relative w-full ${className}`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-rule bg-sheet">
        <div className="absolute inset-x-0 top-1/2 mx-auto w-[62%] -translate-y-1/2">
          <DitherObject shape={shape} res={200} />
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
