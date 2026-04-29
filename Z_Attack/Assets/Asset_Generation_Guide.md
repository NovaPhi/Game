# Z Attack — Asset Generation Guide

Self-contained reference for continuing AI image generation for issue #125. Use ChatGPT Images 2.0.

---

## Status

| Asset class | Count | Status |
|---|---|---|
| Style anchor | 1 | DONE — keep `style_anchor.png` to attach to every prompt below |
| Map backgrounds | 4 | DONE |
| Main-base buildings | 4 | DONE |
| Wall tiles | 4 | TODO |
| Heroes (idle + attack) | 6 | TODO |
| Enemies (idle + attack) | 8 | TODO |
| Mine (3 states) | 3 | TODO |
| Bear trap (3 states) | 3 | TODO |
| Barriers | 0–16 | DEFERRED — decide later (see end of doc) |

**Remaining: 24 generations + barriers.**

---

## Universal rules

### 1. ChatGPT Images 2.0 only outputs three sizes

- 1024×1024 (square)
- 1536×1024 (landscape)
- 1024×1536 (portrait)

It silently ignores any "exactly 64×64" / "exactly 32×32" instruction. Workflow: **generate large → crop in PS → resize to target with Nearest Neighbor**.

### 2. Always attach the style anchor

For every prompt below, attach `style_anchor.png` from the Assets folder. For continuation frames (attack frames, trap states 2 and 3), also attach the previous frame of that same character/object.

### 3. Text never carries over

Each generation is independent. Paste the **full prompt text** every time — including the universal tail. Don't say "same style as before."

### 4. Universal tail (paste at the END of every prompt below)

```
IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor
sampling to a much smaller size for use as a game sprite. Produce crisp,
high-contrast detail with clear silhouettes and bold flat colors. Avoid
soft anti-aliased edges, blurry shading, fine gradients, or thin spindly
details — they turn to mush at the target size. Treat this as
"chunky pixel art": fewer details, but every detail must be unambiguously
readable.
```

### 5. PS recipe by asset class

| Asset | GPT output | PS crop | Final size | Resample |
|---|---|---|---|---|
| Wall tiles | 1024×1024 | none | 32×32 | Nearest Neighbor |
| Heroes | 1024×1024 | crop to subject's square bounding box | 28×28 | Nearest Neighbor |
| Enemies | 1024×1024 | crop to subject's square bounding box | 40×40 | Nearest Neighbor |
| Mine / Bear trap | 1024×1024 | crop to subject's square bounding box | 24×24 | Nearest Neighbor |

Always check the alpha channel after resize. If you see a white/colored fringe at the edges, run **Layer → Matting → Defringe** at 1 px (or 2 px if needed).

Save everything as PNG-32 (preserves transparency).

---

## Naming + location

All generated files go in `Z_Attack/Assets/`. Use exactly these names so the engine code already references them correctly:

- `wall_house.png`, `wall_mall.png`, `wall_hospital.png`, `wall_military.png`
- `warrior_idle.png`, `warrior_attack.png`
- `scout_idle.png`, `scout_attack.png`
- `tank_idle.png`, `tank_attack.png`
- `outpost_idle.png`, `outpost_attack.png`
- `burst_idle.png`, `burst_attack.png`
- `sniper_idle.png`, `sniper_attack.png`
- `turret_idle.png`, `turret_attack.png`
- `mine_idle.png`, `mine_activation.png`, `mine_disappear.png`
- `beartrap_idle.png`, `beartrap_activation.png`, `beartrap_disappear.png`

---

## C. Wall Tiles (4)

**Generate at: 1024×1024 square. PS: resize to 32×32 with Nearest Neighbor. Verify it tiles cleanly by placing 4 copies in a 2×2 grid in PS — if there's a visible seam, regenerate.**

Common preamble:

> *Attach: `style_anchor.png`*
>
> "Match the art style, palette, outline weight, and lighting of the reference image exactly. A single seamless tileable top-down wall tile, transparent background. Render as a square image with the tile texture filling the entire canvas edge-to-edge — no padding, no border. **The tile must tile seamlessly when placed in a horizontal row OR a vertical column** — no directional gradient, no light falloff, no asymmetric shading. The four edges of the tile must visually match each other so adjacent copies have invisible seams."

### `wall_house.png`

> [Common preamble]
>
> Theme: weathered wood plank fence panel with rusty nails. Several horizontal wooden planks of slightly varying brown tones, visible wood grain, a few rusty nail-heads, light splintering. Edges align so the next tile continues the plank pattern naturally.
>
> [UNIVERSAL TAIL]

### `wall_mall.png`

> [Common preamble]
>
> Theme: corrugated metal shutter segment. Beige metal with horizontal ribbed corrugation lines, a few small dents, light surface scratches. Edges align so adjacent tiles continue the ribbing horizontally.
>
> [UNIVERSAL TAIL]

### `wall_hospital.png`

> [Common preamble]
>
> Theme: reinforced concrete block with diagonal yellow-and-black hazard stripes. Pale gray concrete texture with diagonal yellow-and-black caution stripes running across, slight edge weathering. Edges align so the diagonal stripes continue uninterrupted into adjacent tiles.
>
> [UNIVERSAL TAIL]

### `wall_military.png`

> [Common preamble]
>
> Theme: stacked sandbags. Olive-canvas sandbags arranged in a tight pattern, individual bag outlines visible, slight bulges, dust. Edges align so the bag pattern continues into adjacent tiles seamlessly.
>
> [UNIVERSAL TAIL]

---

## D. Heroes (6 — 3 zombies x 2 frames)

**Generate at: 1024×1024 square. PS: crop to subject's square bounding box, resize to 28×28 with Nearest Neighbor. Save the upscaled crop as well — may be needed at 2x for HiDPI.**

> Generate the **idle** for each hero first, save it, then generate the **attack** with both `style_anchor.png` AND that hero's `*_idle.png` attached.

### Common preamble — IDLE frames

> *Attach: `style_anchor.png`*
>
> "Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art of a single zombie character seen from directly above (camera looking straight down). The zombie is **facing south, toward the camera** — head at the top, feet at the bottom of its bounding box. Transparent background. Render as a square image. The zombie is centered and fills roughly 80% of the canvas, with even transparent padding on all four sides."

### Common preamble — ATTACK frames

> *Attach: `style_anchor.png`, `[hero]_idle.png`*
>
> "Match the art style, palette, outline weight, and lighting of the first reference image. Same exact zombie character as the second reference image — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down view from directly above, facing south toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding."

### `warrior_idle.png`

> [Idle preamble]
>
> The zombie: a standard adult male of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe, the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair. Empty hands hanging at his sides. Pose: standing still, weight even on both feet, slight forward sway, shoulders relaxed.
>
> [UNIVERSAL TAIL]

### `warrior_attack.png`

> [Attack preamble]
>
> Pose: mid-attack — both arms thrust straight forward in a melee swipe, fully extended toward the camera (which is below the zombie). Hands open with fingers spread like claws. Mouth wide open showing teeth, head tilted slightly forward. Torso leaning forward, weight on the front foot.
>
> [UNIVERSAL TAIL]

### `scout_idle.png`

> [Idle preamble]
>
> The zombie: a small, scrawny, hunched-over teenage zombie, visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin and eyes that look "up to no good", narrow shoulders, long thin gangly limbs. Pose: standing slightly hunched forward with a twitchy posture, hands at sides with fingers slightly curled.
>
> [UNIVERSAL TAIL]

### `scout_attack.png`

> [Attack preamble]
>
> Pose: mid-attack — lunging forward aggressively with both clawed hands extended toward the camera, fingers splayed wide. Body twisted dynamically with one shoulder dropped lower than the other, hood flapping back slightly from the motion, mouth wide in a snarl, eyes wild.
>
> [UNIVERSAL TAIL]

### `tank_idle.png`

> [Idle preamble]
>
> The zombie: a hugely oversized, bloated zombie — clearly about 1.5x the height and width of a normal adult. Massive belly straining against a torn off-white hospital gown or stained butcher's apron, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, a section of exposed rib bone visible on one side of the torso, dull empty stare, short thick neck almost absent under the jaw. Pose: standing heavy and still, slow lumbering posture, arms hanging slightly out from the body because of his size.
>
> [UNIVERSAL TAIL]

### `tank_attack.png`

> [Attack preamble]
>
> Pose: mid-attack — both massive arms swinging forward together in a heavy double-fisted ground-pound, both fists meeting in front of the zombie at chest height with visible impact lines and a small dust cloud kicking up around the contact point. Torso committed forward, weight planted heavily, mouth open in a roar.
>
> [UNIVERSAL TAIL]

---

## E. Enemies (8 — 4 emplacements x 2 frames)

**Generate at: 1024×1024 square. PS: crop to subject's square bounding box, resize to 40×40 with Nearest Neighbor.**

### Common preamble — IDLE frames

> *Attach: `style_anchor.png`*
>
> "Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art of a single enemy emplacement seen from directly above (camera looking straight down). Transparent background. Render as a square image. The emplacement is centered and fills roughly 80% of the canvas with even transparent padding on all four sides."

### Common preamble — ATTACK frames

> *Attach: `style_anchor.png`, `[enemy]_idle.png`*
>
> "Match the art style, palette, outline weight, and lighting of the first reference image. Same exact emplacement and soldier(s) as the second reference image — identical layout, proportions, colors, equipment, outline. Top-down view from directly above. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding."

### `outpost_idle.png`

> [Idle preamble]
>
> The emplacement: a small fortified guard post — square sandbag-and-wood emplacement viewed from above. One human soldier in olive-drab uniform crouching inside, holding a standard assault rifle pointed outward toward the south. Soldier's helmet visible from above, with a small chinstrap detail. Sandbags form a square wall around him with one open side. Rifle held at ready, soldier visibly scanning, no muzzle flash.
>
> [UNIVERSAL TAIL]

### `outpost_attack.png`

> [Attack preamble]
>
> Pose: firing — rifle raised slightly higher than in the reference, a bright orange-yellow muzzle flash blooming at the barrel tip pointing south, a thin wisp of gray smoke trailing the flash, one ejected brass casing visible mid-air to the soldier's right, slight recoil tilt to the soldier's torso.
>
> [UNIVERSAL TAIL]

### `burst_idle.png`

> [Idle preamble]
>
> The emplacement: a wider sandbag emplacement holding **three** human soldiers in olive-drab uniforms, viewed from above. Soldiers arranged in a small triangle inside the post — one at the front-center facing south, two flanking behind him. Each holds a pump-action shotgun. Sandbag walls around three sides, open south side. Shotguns at rest, soldiers alert and watching outward.
>
> [UNIVERSAL TAIL]

### `burst_attack.png`

> [Attack preamble]
>
> Pose: all three soldiers firing simultaneously southward — three bright orange muzzle blasts at the shotgun barrel tips, fanning slightly outward (left, center, right). Smoke wisps trailing each blast, three ejected red shotgun shells visible mid-air, soldiers' shoulders pushed back from recoil.
>
> [UNIVERSAL TAIL]

### `sniper_idle.png`

> [Idle preamble]
>
> The emplacement: a small elevated camouflaged sniper hide viewed from above. A square wooden platform with green-and-brown camouflage netting partially covering it, a gap in the netting at the south side through which one prone soldier is visible. The soldier is lying flat, holding a long bolt-action sniper rifle pointed south through the gap. Muted green-and-brown tones overall. Rifle resting steady, scope upright, calm composed pose.
>
> [UNIVERSAL TAIL]

### `sniper_attack.png`

> [Attack preamble]
>
> Pose: firing — large bright muzzle flash at the rifle's barrel tip pointing south, a puff of gray smoke surrounding the flash, the soldier's body and shoulders jolted back from the heavy recoil (visibly slid back roughly one body-width). Scope still elevated.
>
> [UNIVERSAL TAIL]

### `turret_idle.png`

> [Idle preamble]
>
> The emplacement: a round armored automated turret viewed from directly above. Hexagonal concrete-and-steel armored base plating in industrial gray with rust-orange weathered patches, a single mounted heavy machine-gun barrel emerging from the center of the hexagon and pointing straight up (north). No human operator visible — fully automated. A small green status-light glow at the base of the barrel.
>
> [UNIVERSAL TAIL]

### `turret_attack.png`

> [Attack preamble]
>
> Pose: firing in all directions — twelve evenly-spaced muzzle blasts arranged radially around the central barrel position, each rendered as a short bright orange-yellow flash mark at the perimeter of the turret pointing outward. The twelve flashes are evenly spaced (every 30 degrees) and identical in size. Hot orange glow emanating from the turret's center. The barrel itself is rendered with motion-blur indicating fast rotation. The status-light is now bright red.
>
> [UNIVERSAL TAIL]

---

## F. Mine (3 frames)

**Generate at: 1024×1024 square. PS: crop to subject's square bounding box, resize to 24×24 with Nearest Neighbor.**

> Generate state 1 first. State 2 attaches state 1. State 3 attaches state 2.

### Common preamble

> *Attach: `style_anchor.png` (and previous state where applicable)*
>
> "Match the art style, palette, outline weight, and lighting of the first reference image. Top-down pixel art view from directly above. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding."

### `mine_idle.png`

> [Common preamble — attach style anchor only]
>
> A circular pressure-plate landmine seen from directly above. Dark olive-drab metal disc with a slightly raised central circular pressure plate, three exposed dark bolt-heads spaced evenly around the rim, a tiny "DANGER" stencil mark in faded white text on one side of the rim, a small dim red status LED at one edge. The mine sits flat on dirt-colored ground with a small soft south-east shadow.
>
> [UNIVERSAL TAIL]

### `mine_activation.png`

> *Attach: `style_anchor.png` AND `mine_idle.png`*
>
> [Common preamble]
>
> Same exact mine as the second reference image, mid-explosion. A bright white-yellow flash bloom filling roughly the central 50% of the frame, debris specks (small dark fragments) radiating outward in all directions, a forming gray smoke ring around the flash, the mine body itself visibly cracking with bright yellow-orange fissures glowing through the cracks. Same color palette and style as the reference.
>
> [UNIVERSAL TAIL]

### `mine_disappear.png`

> *Attach: `style_anchor.png` AND `mine_activation.png`*
>
> [Common preamble]
>
> Same scene as the second reference image, now resolving. Just dissipating gray smoke wisps drifting upward, a few small orange embers fading out, a small black scorch crater on the dirt ground where the mine was. The mine itself is GONE — only the crater and smoke remain. Same color palette and style as the reference.
>
> [UNIVERSAL TAIL]

---

## G. Bear Trap (3 frames)

**Generate at: 1024×1024 square. PS: crop to subject's square bounding box, resize to 24×24 with Nearest Neighbor.**

### `beartrap_idle.png`

> *Attach: `style_anchor.png`*
>
> [Common preamble — same as Mine's]
>
> A circular steel jaw bear-trap seen from directly above. Two semicircular jaws OPEN wide (one half above, one half below) with sharp triangular metal teeth pointing toward each other across the central pressure plate, the round pressure plate exposed in the middle, a small metal chain link visible attached to the rim at one edge, dark rusted iron coloring with darker shadow detail. Sitting on dirt ground.
>
> [UNIVERSAL TAIL]

### `beartrap_activation.png`

> *Attach: `style_anchor.png` AND `beartrap_idle.png`*
>
> [Common preamble]
>
> Same exact bear-trap as the second reference image, but now SNAPPED CLOSED. The two jaws are fully closed together, teeth interlocked across the middle so the trap looks like a closed mouth, central pressure plate hidden behind the teeth, a small puff of dust kicking up around the trap, a few sharp impact lines radiating outward from the closure to indicate the metallic clang. Same chain link, same colors, same lighting.
>
> [UNIVERSAL TAIL]

### `beartrap_disappear.png`

> *Attach: `style_anchor.png` AND `beartrap_activation.png`*
>
> [Common preamble]
>
> Same closed bear-trap as the second reference image, now fading away. The trap rendered at roughly 25% opacity (mostly transparent, ghost-like), a faint dirt indent / depression in the ground beneath where the trap sat (visible as a slight darker oval), a few dust particles rising upward. Trap is almost gone.
>
> [UNIVERSAL TAIL]

---

## Barriers — DEFERRED

Pending decision between three approaches. Pick one when ready:

- **Option B — 4 seamless texture tiles** (one per theme: rubble / asphalt-debris / hospital-debris / sandbag-mound). Engine fills each random-sized barrier rect via `ctx.createPattern`. **4 generations.** Trade-off: barriers become abstract texture patterns, not recognizable props.
- **Option C — 16 individual barrier props** (4 themes × 4 props at fixed preset sizes — e.g. car 96×48, hedge 80×32, etc.). Requires a small code change to spawn from a preset list instead of `randInt(30,90)`. **16 generations.** Trade-off: more work, but each barrier is a recognizable object (car, ambulance, jeep) at a natural aspect ratio. Recommended option.
- **Option D — Skip entirely.** Keep the current colored-rect rendering. **0 generations.**

When you decide, I will deliver the corresponding prompt block.

---

## Recommended generation order (for tomorrow)

1. **Wall tiles (4)** — quick wins, all small, all simple. Verify tiling immediately by placing 4 copies in a 2×2 grid in PS.
2. **Heroes (6)** — slowest because each attack frame depends on the idle. Generate all 3 idles first, then all 3 attacks.
3. **Enemies (8)** — same pattern. All 4 idles, then all 4 attacks.
4. **Mine (3)** — sequential, each frame depends on the previous.
5. **Bear trap (3)** — same.
6. **Barriers** — only after deciding on option B/C/D.

Total time estimate: 24 generations × ~30 sec each = ~12 min of GPT time + PS cleanup per asset.

---

## When done

Drop everything in `Z_Attack/Assets/` with the exact filenames listed above. The engine code already references those paths, so they will load automatically once present. Press **B** in-game to cycle themes and verify each visual.
