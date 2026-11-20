// Renders the site's raster icons and share image from the official logo files in public/brand/logo/.
// The logo SVGs are used exactly as delivered; this script only rasterises and composes them.
// Run after the logo files change: node brand/build-icons.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = (f) => readFileSync(join(root, "public/brand/logo", f), "utf8");
const out = (f, data) => {
  mkdirSync(dirname(join(root, f)), { recursive: true });
  writeFileSync(join(root, f), data);
  console.log("wrote", f);
};
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

const CHARCOAL = "#202124";
const WARM_WHITE = "#f7f5f2";

/** The inner content and viewBox of a logo file, so it can be placed inside another SVG. */
function parts(svg) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>.*?<\/title>/, "");
  return { w, h, inner };
}

// Favicons: the 16 and 32 px drawings at their own sizes, 48 from the 32 drawing.
const fav16 = logo("favicon-16.svg");
const fav32 = logo("favicon-32.svg");
const icoImages = [
  [16, png(fav16, 16)],
  [32, png(fav32, 32)],
  [48, png(fav32, 48)],
];
// ICO container with PNG entries (supported by every current browser).
const header = Buffer.alloc(6 + 16 * icoImages.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = header.length;
icoImages.forEach(([size, data], i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(size, e);
  header.writeUInt8(size, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(data.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += data.length;
});
out("app/favicon.ico", Buffer.concat([header, ...icoImages.map(([, d]) => d)]));
out("app/icon.svg", fav32);

// App icons from the charcoal tile.
const tile = logo("anvionix-ax-icon.svg");
// iOS rounds the corners itself and fills transparency with black, so the apple icon is full-bleed.
out("app/apple-icon.png", png(tile.replace(/ rx="[\d.]+"/, ""), 180));
out("public/icons/icon-192.png", png(tile, 192));
out("public/icons/icon-512.png", png(tile, 512));

// Maskable: full-bleed charcoal, the tile's artwork inside the 80% safe zone.
{
  const t = parts(tile);
  const art = t.inner.replace(/<rect[^>]*\/>/, "");
  const s = 0.8;
  const pad = (t.w * (1 - s)) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t.w} ${t.h}"><rect width="${t.w}" height="${t.h}" fill="${CHARCOAL}"/><g transform="translate(${pad} ${pad}) scale(${s})">${art}</g></svg>`;
  out("public/icons/icon-maskable-512.png", png(svg, 512));
}

// Share image: the lockup centred on Warm White, with a burnt orange rule. Palette only.
{
  const W = 1200;
  const H = 630;
  const l = parts(logo("anvionix-ax-lockup-light.svg"));
  const lw = 760;
  const s = lw / l.w;
  const x = (W - lw) / 2;
  const y = (H - l.h * s) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${WARM_WHITE}"/><rect x="0" y="${H - 12}" width="${W}" height="12" fill="#c56a3a"/><g transform="translate(${x} ${y}) scale(${s})">${l.inner}</g></svg>`;
  out("public/og.png", png(svg, W));
}
