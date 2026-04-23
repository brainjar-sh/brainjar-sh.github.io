---
version: alpha
name: The Instrument
description: Visual identity for brainjar — an open-source tool that shapes how AI agents think.
colors:
  primary: "#0E1013"
  neutral: "#EDEDEA"
  secondary: "#8A8F94"
  accent: "#00E08A"
  warning: "#E8793A"
typography:
  display:
    fontFamily: Neue Haas Grotesk Display
    fontSize: 3rem
    fontWeight: 500
    letterSpacing: "-0.02em"
    lineHeight: 1.05
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  mono-md:
    fontFamily: Berkeley Mono
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: Berkeley Mono
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: "0.08em"
    fontFeature: '"smcp" on'
---

## Overview

The Instrument. A precision-tool aesthetic for a tool that shapes how AI agents
think. Every element is load-bearing — nothing decorative, nothing ornamental.
The UI reads like a machinist's drawing or a scientific instrument panel:
rigorous grid, hairline rules, exact alignment, generous negative space.

No gradients. No glow. No glass morphism. No neural-net imagery, no
purple-blue AI tropes. The work speaks through proportion, typographic
discipline, and the deliberate use of a single accent at a time.

brainjar is an open-source developer tool. Its audience is senior engineers
and OSS contributors who recognize craft and recoil from theater. The identity
should feel closer to a well-made chisel than to a marketing deck.

## Colors

The palette is a high-contrast neutral core with two functional accents. Most
surfaces are Bone or Graphite; Steel carries secondary information; Signal
Green and Ember appear sparingly and never together.

- **Graphite / `primary` (#0E1013)** — deep near-black for primary text on
  light surfaces and for dark-mode backgrounds. Not pure black; carries a
  faint blue cast that reads as ink rather than void.
- **Bone / `neutral` (#EDEDEA)** — warm off-white foundation. The default
  page color in light mode. Softer than paper white, closer to unbleached
  linen.
- **Steel / `secondary` (#8A8F94)** — neutral slate for captions, metadata,
  hairline rules, disabled states, secondary borders. Never for primary text.
- **Signal Green / `accent` (#00E08A)** — the interaction color. Reserved
  for active state, successful output, the caret, key CTAs, and live
  indicators. Appears in small quantities; loses meaning if overused.
- **Ember / `warning` (#E8793A)** — reserved for destructive actions,
  errors, and editorial emphasis. Never decorative.

Use one accent per view. If Signal Green is present, Ember sits out.

## Typography

Three territories, each with a job. No display serifs, no script faces, no
rounded humanist sans. The type does precision work.

- **Display grotesk** — `Neue Haas Grotesk Display` (fallbacks: `GT America`,
  `Söhne Breit`). Tight tracking, medium weight, used large. For hero
  wordmarks, section titles, numeric readouts.
- **Body grotesk** — `Inter` (fallbacks: `Söhne`, `Basis Grotesque`). The
  workhorse. All running prose, UI labels, form fields.
- **Mono** — `Berkeley Mono` (fallbacks: `IBM Plex Mono`, `TX-02`). Shell
  commands, code, JSON, keyboard shortcuts, and — set in small caps with
  tracking — section labels and metadata captions.

Small-caps mono at tracked 0.08em is the identity's signature label treatment.
It reads as engraved rather than typeset.

## Shapes

Rules, borders, and frames are structural — never ornamental. The border
vocabulary is small and each treatment has a defined job. Corners are square;
there is no rounding anywhere in the system. Shadows and gradients do not
exist in this identity.

- **Double hairline** — two 1px Steel rules with a 2px gap between them.
  Reserved for major structural breaks: under the top navigation, above the
  footer, between the hero and the body on landing surfaces, end-of-article.
- **Single hairline** — 1px Steel. Standard divider: between nav items,
  between cards, under `h2`, between table rows. The workhorse rule.
- **Dashed hairline** — 1px Steel, 4px dash, 3px gap. Soft or provisional
  separation: collapsed sections, placeholders, "continued below" markers,
  draft or unpublished content.
- **Boxed panel** — 1px Graphite frame around a content block. Used for
  reference-style content: code specimens, API parameter tables, figure
  blocks with numbered captions, callout panels. The frame carries the
  content; no fill, no shadow.
- **Inset hairline border** — 1px Steel rule set 24px inside the outer edge
  of a surface. Reserved for hero framing and OG-card compositions. Evokes
  a broadside or specimen sheet.

### Application rules

- Never stack two different rule treatments adjacent to each other.
- Boxed panels do not nest. If you need a panel inside a panel, use a single
  hairline divider instead.
- In dark mode, Steel rules lift to 24% Bone; Graphite frames become 40%
  Bone. The weight of the rule does not change, only the tone.
- Rounded corners are forbidden across the system — buttons, cards, inputs,
  code blocks, images, avatars. Square edges only.
