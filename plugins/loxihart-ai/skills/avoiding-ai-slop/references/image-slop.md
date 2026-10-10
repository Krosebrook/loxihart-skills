# Image slop — negative-prompt pack + audit checklist

Scope: prompt-time bans and review-time checks for AI-generated imagery.
Sources: `image-practitioner` (OpenArt guidance, practitioner negative-prompt lists),
`patterns-study` (Patterns journal: paired image models converge on ~12 generic
motifs — "visual elevator music"), `generated` (register-specific additions).
Cross-references at bottom — this file deliberately does NOT duplicate the icon
layer or brand-token gates.

---

## 1. Negative-prompt pack

Paste-ready keyword groups. Use the group headers to pick per-job; don't dump
all of them into every prompt (negative-prompt stuffing degrades some models).

### Skin / surface  `[image-practitioner]`
```
waxy skin, porcelain skin, plastic sheen, airbrushed pores, poreless face,
vacuum-sealed smoothness, uncanny facial symmetry, doll-like skin
```

### Lighting  `[image-practitioner]`
```
golden-hour backlight on everything, volumetric god rays, lens flare,
dramatic rim lighting on every subject, HDR halo, glow around edges
```

### Color grade  `[image-practitioner]`
```
teal-and-orange grade, oversaturated sunset, purple-blue tech gradient,
neon cyberpunk gloss, chrome reflections, dreamy bokeh haze, vaseline blur
```

### Composition  `[image-practitioner]`
```
dead-center subject, perfect bilateral symmetry, floating subject with no
ground contact, cluttered maximal detail in every region, no negative space
```

### Tech-cliché motifs (the AI-article header set)  `[patterns-study, image-practitioner]`
```
glowing blue brain, circuit-board head, humanoid robot typing at laptop,
robot-and-human handshake, hooded hacker with binary rain, low-poly globe
with network arcs, ascending arrow over city skyline, lightbulb with gears,
floating holographic UI panels, big-eyed 3D mascot, Ghibli-filter portrait,
motivational quote over AI-generated sunset
```

### Prompt-boilerplate bans (don't write these INTO prompts)  `[generated]`
```
cinematic, ultra-detailed, 8k, trending on artstation, masterpiece,
hyperrealistic, award-winning, 35mm, f/1.4 bokeh
```
These strings are the textual slop of image prompting — they steer every model
toward the same default look. Specify subject, medium, light source, palette,
and composition intent instead.

---

## 2. Why motifs, not just keywords  `[patterns-study]`

The Patterns-journal result: independent image models, prompted on the same
abstract concepts, converge on a small shared motif set (~12) — the visual
equivalent of stock phrases. Keyword bans alone don't fix this; the fix is
specifying a concrete visual idea the model can't default its way out of.

Practitioner method worth adopting: collect ~50 AI images you dislike, list
what repeats, and append those items to the pack above. The personal negative
list beats any generic one within a month of use.

---

## 3. Review-time audit checklist (12 checks)

Run on any AI image before it ships. Any "no" = revise or regenerate.

1. Skin has visible texture (pores, asymmetry) — not waxed?
2. Every light source is physically motivated in-scene?
3. Grade chosen on purpose — not default teal-orange/neon?
4. Composition off-center where the content calls for it?
5. All visible text/signage is real, legible language?
6. Hands, ears, teeth, jewelry consistent and anatomically sane?
7. Background objects are functional (door handles, cables, shadows land)?
8. Style was specified — or did the model's house style fill the vacuum?
9. Cast/setting isn't defaulting to the model's demographic priors?
10. No motif from the tech-cliché set above?
11. Reflections/mirrors consistent with scene geometry?
12. Would a stock-photo search produce this exact image? If yes, why generate it?

---

## 4. Cross-references (no duplication here)

- **Icon layer** → `purging-icon-slop` skill owns generic-icon bans (lucide/
  heroicons/emoji-as-icon, sparkles/bolts/brains/shields). Not restated here.
- **Brand tokens** → Abstrekkt / `managing-design-briefs` gates own palette,
  type, and layout enforcement. This file only covers generation-slop, not
  brand compliance.
