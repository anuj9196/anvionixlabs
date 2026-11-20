# Anvionix Labs brand

One brand on every page: Palette C, Charcoal + Burnt Orange. Tokens live in
[`brand/tokens.css`](brand/tokens.css) and [`brand/tokens.json`](brand/tokens.json); the site maps them
onto its semantic tokens in [`app/globals.css`](app/globals.css).

## Logo

> **Placeholder.** The official Anvionix Labs logo package is on its way. This section will list
> the files, which one to use where, clear space and minimum sizes once the package is in the repo.
> Until then the header and footer keep the text wordmark (`Anvionix/Labs`).

What is settled from the brand board:

- **Primary:** the A/X monogram with the ANVIONIX wordmark and LABS below it.
- **Alternative:** the modular lab symbol (three blocks). Not used on the site.
- Colours: on light, charcoal with the burnt orange stroke; on dark, white with the burnt orange
  stroke.

## Palette

| Name | Hex | Role |
|---|---|---|
| Charcoal | `#202124` | Primary: text on light, background in dark mode and the closing band |
| Graphite | `#45464A` | Secondary: body text on light, secondary surfaces |
| Burnt Orange | `#C56A3A` | Accent: fills, borders, rules, focus rings, large display |
| Sand | `#E4A47E` | Highlight: text highlights, accent text on charcoal |
| Warm White | `#F7F5F2` | Background (light), text on charcoal |

Derived shades, for text that has to pass WCAG AA:

| Name | Hex | Use |
|---|---|---|
| Burnt Orange Deep | `#A9532A` | Accent-coloured text, and orange buttons or chips that carry text, on light |
| Muted | `#6B6C70` | Tertiary text (labels, captions) on light |
| Sheet dark | `#2A2B2F` | Raised surfaces (cards, inputs) on charcoal |
| Ink 2 dark | `#CFCDC8` | Secondary text on charcoal |
| Muted dark | `#A3A4A8` | Tertiary text on charcoal |

Functional colours, never decoration: green `#1D7A4F` / `#5FD39A` (dark) for "live" status, red
`#B3261E` / `#FF8A7A` (dark) for form errors.

### Site tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | Warm White | Charcoal | Page background |
| `--sheet` | `#FFFFFF` | `#2A2B2F` | Cards, inputs |
| `--ink` | Charcoal | Warm White | Headings, body |
| `--ink-2` | Graphite | `#CFCDC8` | Secondary text |
| `--ink-3` | `#6B6C70` | `#A3A4A8` | Labels, captions |
| `--accent` | Burnt Orange | Burnt Orange | Non-text accents only |
| `--accent-strong` | `#A9532A` | Sand | Accent text; fills that carry text |
| `--accent-ink` | `#FFFFFF` | Charcoal | Text on `--accent-strong` |
| `--mark` | Sand 38% | Burnt Orange 35% | Selection and highlighter |

`.inverse` gives any section the dark tokens whatever the system scheme (the closing call-to-action
band uses it).

### Contrast (WCAG 2.1)

AA needs 4.5:1 for body text and 3:1 for large text (24px, or 18.66px bold) and UI parts.

| Text | Background | Ratio | Result |
|---|---|---|---|
| Charcoal | Warm White | 14.79:1 | AAA |
| Charcoal | White | 16.10:1 | AAA |
| Graphite | Warm White | 8.66:1 | AAA |
| Muted `#6B6C70` | Warm White | 4.82:1 | AA |
| Muted `#6B6C70` | White | 5.24:1 | AA |
| **Burnt Orange** | **Warm White** | **3.51:1** | **Large text and UI only** |
| Burnt Orange Deep | Warm White | 4.88:1 | AA |
| Burnt Orange Deep | White | 5.31:1 | AA |
| **White** | **Burnt Orange** | **3.82:1** | **Large text only** |
| **Charcoal** | **Burnt Orange** | **4.21:1** | **Large text only** |
| White | Burnt Orange Deep | 5.31:1 | AA |
| **Sand** | **Warm White** | **1.95:1** | **Never for text** |
| Charcoal | Sand | 7.60:1 | AAA |
| Red `#B3261E` | Warm White | 6.01:1 | AA |
| Green `#1D7A4F` | Warm White | 4.89:1 | AA |
| Warm White | Charcoal | 14.79:1 | AAA |
| Ink 2 dark `#CFCDC8` | Charcoal | 10.13:1 | AAA |
| Muted dark `#A3A4A8` | Charcoal | 6.46:1 | AA |
| Muted dark `#A3A4A8` | Sheet dark | 5.68:1 | AA |
| Sand | Charcoal | 7.60:1 | AAA |
| Sand | Sheet dark | 6.67:1 | AA |
| **Burnt Orange** | **Charcoal** | **4.21:1** | **Large text and UI only** |
| **Graphite** | **Charcoal** | **1.71:1** | **Never for text** |
| Red `#FF8A7A` | Charcoal | 7.03:1 | AAA |
| Warm White | Graphite | 8.66:1 | AAA |

Restricted pairs, in short:

- Burnt Orange is never body text on Warm White, White or Charcoal. Use Burnt Orange Deep on light
  and Sand on dark.
- A Burnt Orange button can't carry normal-size text in white or charcoal. Buttons that carry text
  use Burnt Orange Deep with white text (light) or Sand with charcoal text (dark).
- Sand on light, and Graphite on Charcoal, are decoration only.

## Type

The site sets type with Geist (sans), Geist Mono and Instrument Serif, all OFL, loaded through
`next/font/google`. The logo wordmark is set in Montserrat (SIL Open Font License 1.1); the logo
files carry it as outlines, so they never depend on a webfont.

## Do

- Keep one palette on every page; pages differ by layout and motion, not by colour scheme.
- Use Burnt Orange sparingly: one accent per view, on rules, dots, focus rings and large display.
- Use `--accent-strong` for any accent-coloured text.
- Check new text pairs against the table above, in light and dark.

## Don't

- Don't add per-page colour schemes or new hues.
- Don't put normal-size text in Burnt Orange, or on a Burnt Orange fill.
- Don't recolour, stretch, rotate or add effects to the logo.
