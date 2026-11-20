import Image from "next/image";
import { LOGO, SITE } from "@/data/site";

/**
 * The official logo files (public/brand/logo, BRAND.md), light or dark to follow the system scheme.
 * `height` is the rendered height in px; the width follows the file's proportions.
 */
export function Lockup({ height = 28, className = "" }: { height?: number; className?: string }) {
  const width = Math.round((height * 651.29) / 123.64);
  return (
    <span className={`inline-flex ${className}`}>
      <Image src={LOGO.lockupLight} alt={SITE.name} width={width} height={height} priority className="dark:hidden" />
      <Image src={LOGO.lockupDark} alt={SITE.name} width={width} height={height} priority className="hidden dark:block" />
    </span>
  );
}

/** The A/X monogram alone, for spaces too narrow for the lockup (minimum 24 px high). */
export function Mark({ height = 24, className = "" }: { height?: number; className?: string }) {
  const width = Math.round((height * 246.74) / 123.04);
  return (
    <span className={`inline-flex ${className}`}>
      <Image src={LOGO.markLight} alt={SITE.name} width={width} height={height} priority className="dark:hidden" />
      <Image src={LOGO.markDark} alt={SITE.name} width={width} height={height} priority className="hidden dark:block" />
    </span>
  );
}
