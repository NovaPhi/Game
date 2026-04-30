# Z Attack — Asset Generation Phase 2 (Assembled Prompts)

**74 fully-assembled prompts.** Workflow per generation:

1. Open ChatGPT Images 2.0
2. Attach the reference images listed under each prompt
3. Copy the code block and paste
4. Hit enter

Read alongside `Asset_Generation_Guide.md` for workflow rules (3 GPT sizes, attach style anchor, downscale Nearest Neighbor in PS).

---

## Quick Status

| Already done | Notes |
|---|---|
| `style_anchor.png` | Attach to every prompt |
| 4 BGs, 4 main bases, 4 wall tiles | Done |
| 3 hero idle south (`warrior_idle.png`, `scout_idle.png`, `tank_idle.png`) | Reference for walk prompts |
| 3 hero attack PEAK south (`warrior_attack.png`, `scout_attack.png`, `tank_attack.png`) | Reference for windup + recovery. Will be renamed to `*_attack_2.png` |
| 4 enemy idle (`outpost_idle.png`, `burst_idle.png`, `sniper_idle.png`, `turret_idle.png`) | Reference for attack prompts |
| 4 enemy attack PEAK | Reference for windup + recovery. Will be renamed to `*_attack_2.png` |
| Mine, Bear trap | Done |

| Phase 2 deliverable | Count |
|---|---|
| Hero walk frames (3 heroes × 3 directions × 4 frames) | 36 |
| Hero attack windup + recovery (south only) | 6 |
| Enemy attack windup + recovery (south-facing, engine rotates) | 8 |
| Themed barriers | 24 |
| **Total** | **74** |

## Recommended generation order

1. Hero south walks (12 — frame 1 of each becomes a reference for east/north)
2. Hero east walks (12)
3. Hero north walks (12)
4. Hero attack expansion (6)
5. Enemy attack expansion (8)
6. Barriers (24, any order)

## File rename pass before generating

Rename existing files so the new windup/recovery slot in cleanly:

```
warrior_attack.png → warrior_attack_2.png
scout_attack.png   → scout_attack_2.png
tank_attack.png    → tank_attack_2.png
outpost_attack.png → outpost_attack_2.png
burst_attack.png   → burst_attack_2.png
sniper_attack.png  → sniper_attack_2.png
turret_attack.png  → turret_attack_2.png
```

(The windup files will be `*_attack_1.png`, recovery files will be `*_attack_3.png`.)

---

# WARRIOR — Walk Cycle (12 frames)

## warrior_walk_south_1.png

**Attach:** `style_anchor.png` + `warrior_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 1 of 4 — Right foot stepped forward, left foot back. Body straight up, slight forward lean. Arms swing naturally — left arm slightly forward, right arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_south_2.png

**Attach:** `style_anchor.png` + `warrior_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 2 of 4 — Both feet together at center, body raised 1 px upward (mid-stride bob up), arms passing through neutral at the sides. This is the up-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_south_3.png

**Attach:** `style_anchor.png` + `warrior_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 3 of 4 — Left foot stepped forward, right foot back (mirror of frame 1). Body straight up, slight forward lean. Arms swing naturally — right arm slightly forward, left arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_south_4.png

**Attach:** `style_anchor.png` + `warrior_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 4 of 4 — Both feet together at center, body lowered 1 px downward (mid-stride bob down), arms passing through neutral at the sides. This is the down-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_east_1.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, only one shoulder closer to the viewer, half the face visible (one eye, profile of the nose and jaw). The leading edge of the body is on the right side of the bounding box.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 1 of 4 (side profile) — Far leg (the one farther from camera) striding forward to the east, close leg back to the west. Big visible side-profile stride. Arm farthest from camera swings forward, arm closest to camera swings back. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_east_2.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, only one shoulder closer to the viewer, half the face visible (one eye, profile of the nose and jaw). The leading edge of the body is on the right side of the bounding box.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 2 of 4 (side profile) — Legs crossing through middle, body raised 1 px upward (mid-stride bob up), arms passing through neutral. This is the up-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_east_3.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, only one shoulder closer to the viewer, half the face visible (one eye, profile of the nose and jaw). The leading edge of the body is on the right side of the bounding box.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 3 of 4 (side profile) — Close leg (the one closer to camera) striding forward to the east, far leg back to the west. Mirror of frame 1. Arm closest to camera swings forward, arm farthest from camera swings back. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_east_4.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, only one shoulder closer to the viewer, half the face visible (one eye, profile of the nose and jaw). The leading edge of the body is on the right side of the bounding box.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WALK FRAME 4 of 4 (side profile) — Legs crossing through middle, body lowered 1 px downward (mid-stride bob down), arms passing through neutral. This is the down-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_north_1.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of head visible at the top of the frame, no face visible, the zombie is turned away. The back of the clothing (the rear of the gray work shirt, the back of the trousers) is what we see.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt (back side visible), ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin on the neck and arms, short matted dark hair on the back of the head.

Pose: WALK FRAME 1 of 4 (back view) — Right foot stepped forward (toward the top of the frame), left foot back. Body straight up, slight forward lean toward the north. Arms swing naturally — left arm slightly forward, right arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_north_2.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of head visible at the top of the frame, no face visible, the zombie is turned away. The back of the clothing is what we see.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt (back side visible), ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin on the neck and arms, short matted dark hair on the back of the head.

Pose: WALK FRAME 2 of 4 (back view) — Both feet together at center, body raised 1 px upward (mid-stride bob up), arms passing through neutral at the sides. This is the up-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_north_3.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of head visible at the top of the frame, no face visible, the zombie is turned away. The back of the clothing is what we see.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt (back side visible), ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin on the neck and arms, short matted dark hair on the back of the head.

Pose: WALK FRAME 3 of 4 (back view) — Left foot stepped forward (toward the top of the frame), right foot back (mirror of frame 1). Body straight up, slight forward lean toward the north. Arms swing naturally — right arm slightly forward, left arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_walk_north_4.png

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of head visible at the top of the frame, no face visible, the zombie is turned away. The back of the clothing is what we see.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt (back side visible), ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin on the neck and arms, short matted dark hair on the back of the head.

Pose: WALK FRAME 4 of 4 (back view) — Both feet together at center, body lowered 1 px downward (mid-stride bob down), arms passing through neutral at the sides. This is the down-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# WARRIOR — Attack Cycle (2 frames: windup + recovery)

## warrior_attack_1.png  (windup)

**Attach:** `style_anchor.png` + `warrior_idle.png` + `warrior_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (idle frame) and third reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: WINDUP — the zombie is preparing to strike. Both arms drawn back behind the torso (visible as elbows poking out at the sides), shoulders coiled, weight shifted onto the back foot, body twisted slightly toward the right. Mouth opening, head tilted forward and down. This is the moment just BEFORE the strike pose shown in the third reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## warrior_attack_3.png  (recovery)

**Attach:** `style_anchor.png` + `warrior_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A standard adult male zombie of average build and average height. Tattered gray work shirt, ripped dark trousers, one missing shoe with the other a dirty work boot. Greenish-gray rotting skin, dark bloodstains on chest, sunken eyes, slack jaw with a slight overbite, short matted dark hair.

Pose: RECOVERY — the zombie is settling after the strike. Both arms returning toward the body but still slightly extended forward (about half the extension shown in the second reference image), torso relaxing back to upright, weight shifting back to even, mouth still open but starting to close. This is the moment just AFTER the strike in the reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# SCOUT — Walk Cycle (12 frames)

## scout_walk_south_1.png

**Attach:** `style_anchor.png` + `scout_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A small, scrawny, hunched-over teenage zombie — visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin and eyes that look "up to no good", narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 1 of 4 — Right foot stepped forward, left foot back. The zombie maintains his hunched, slinking posture with shoulders forward and head jutted out. Slight forward lean. Arms swing naturally with bent elbows — left arm slightly forward, right arm slightly back. Twitchy, slinking motion.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_south_2.png

**Attach:** `style_anchor.png` + `scout_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A small, scrawny, hunched-over teenage zombie — visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin and eyes that look "up to no good", narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 2 of 4 — Both feet together at center, body raised 1 px upward (mid-stride bob up), arms passing through neutral at the sides. The zombie maintains his hunched posture with shoulders forward and head jutted out. Up-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_south_3.png

**Attach:** `style_anchor.png` + `scout_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A small, scrawny, hunched-over teenage zombie — visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin and eyes that look "up to no good", narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 3 of 4 — Left foot stepped forward, right foot back (mirror of frame 1). Hunched, slinking posture maintained. Slight forward lean. Arms swing naturally — right arm slightly forward, left arm slightly back. Twitchy motion.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_south_4.png

**Attach:** `style_anchor.png` + `scout_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A small, scrawny, hunched-over teenage zombie — visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin and eyes that look "up to no good", narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 4 of 4 — Both feet together at center, body lowered 1 px downward (mid-stride bob down), arms passing through neutral at the sides. Hunched posture maintained. Down-bob passing pose between strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_east_1.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, hunched over with the head jutting forward (eastward), only one shoulder closer to the viewer, half the face visible (one eye, profile of the nose and jaw). The leading edge of the body is on the right side.

The zombie: A small, scrawny, hunched-over teenage zombie — visibly shorter and thinner than an adult. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin, narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 1 of 4 (side profile) — Far leg striding forward to the east, close leg back to the west. Big visible side-profile stride. Arm farthest from camera swings forward, arm closest to camera swings back. Hunched posture maintained throughout. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_east_2.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, hunched with head jutting eastward, half the face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin, narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 2 of 4 (side profile) — Legs crossing through middle, body raised 1 px upward (mid-stride bob up), arms passing through neutral. Hunched posture maintained. Up-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_east_3.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, hunched with head jutting eastward, half the face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin, narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 3 of 4 (side profile) — Close leg striding forward to the east, far leg back to the west (mirror of frame 1). Hunched posture maintained. Arm closest to camera swings forward, arm farthest swings back. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_east_4.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — body in side profile, head turned to the right edge of the frame, hunched with head jutting eastward, half the face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin, narrow shoulders, long thin gangly limbs.

Pose: WALK FRAME 4 of 4 (side profile) — Legs crossing through middle, body lowered 1 px downward (mid-stride bob down), arms passing through neutral. Hunched posture maintained. Down-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_north_1.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the hood visible at the top of the frame, no face visible. The back of the hoodie and jeans is what we see.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up (back of hood visible), ragged jeans, scuffed sneakers. Pale yellow-green skin on the back of the neck and gangly arms, narrow shoulders.

Pose: WALK FRAME 1 of 4 (back view) — Right foot stepped forward (toward the top of the frame), left foot back. Hunched posture maintained, head jutting forward (north). Arms swing — left arm slightly forward, right arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_north_2.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the hood visible at the top of the frame, no face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up (back of hood visible), ragged jeans, scuffed sneakers. Pale yellow-green skin, narrow shoulders, long thin limbs.

Pose: WALK FRAME 2 of 4 (back view) — Both feet together at center, body raised 1 px upward (mid-stride bob up), arms passing through neutral. Hunched posture maintained. Up-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_north_3.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the hood visible at the top of the frame, no face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up (back of hood visible), ragged jeans, scuffed sneakers. Pale yellow-green skin, narrow shoulders, long thin limbs.

Pose: WALK FRAME 3 of 4 (back view) — Left foot stepped forward (toward the top of the frame), right foot back (mirror of frame 1). Hunched posture maintained. Arms swing — right arm slightly forward, left arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_walk_north_4.png

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the hood visible at the top of the frame, no face visible.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up (back of hood visible), ragged jeans, scuffed sneakers. Pale yellow-green skin, narrow shoulders, long thin limbs.

Pose: WALK FRAME 4 of 4 (back view) — Both feet together at center, body lowered 1 px downward (mid-stride bob down), arms passing through neutral. Hunched posture maintained. Down-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# SCOUT — Attack Cycle (2 frames)

## scout_attack_1.png  (windup)

**Attach:** `style_anchor.png` + `scout_idle.png` + `scout_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (idle frame) and third reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face with a sneaky toothy grin, narrow shoulders, long thin gangly limbs.

Pose: WINDUP — the scout is coiled to lunge. Both clawed hands drawn back near the chest, body crouched lower than its idle pose, one shoulder pulled back further than the other (loaded for the lunge), head ducked low, mouth open in a snarl, eyes wild and fixed forward. Anticipation pose, weight loaded on the back foot. This is the moment just BEFORE the strike pose shown in the third reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## scout_attack_3.png  (recovery)

**Attach:** `style_anchor.png` + `scout_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A small, scrawny, hunched-over teenage zombie. Torn dirty hoodie with the hood up, ragged jeans, scuffed sneakers. Pale yellow-green skin, gaunt face, narrow shoulders, long thin gangly limbs.

Pose: RECOVERY — the scout is pulling back from the lunge. Both arms retracting toward the chest from the extended strike position, body straightening from the lunge but still hunched, hood settling back into place after the motion. Half-extended arms, mouth closing. This is the moment just AFTER the strike in the reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# TANK — Walk Cycle (12 frames)

## tank_walk_south_1.png

**Attach:** `style_anchor.png` + `tank_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A hugely oversized bloated zombie — clearly about 1.5x the height and width of a normal adult. Massive belly straining against a torn off-white hospital gown / stained butcher's apron, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, a section of exposed rib bone visible on one side of the torso, dull empty stare, short thick neck almost absent under the jaw.

Pose: WALK FRAME 1 of 4 — Right foot stepped forward, left foot back. Slow, heavy, lumbering motion. The zombie's massive bulk shifts heavily to the side with this step, the huge belly visibly swaying. Body weight committed forward and slightly to the right. Arms swing slowly with the shift — left arm slightly forward, right arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_south_2.png

**Attach:** `style_anchor.png` + `tank_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A hugely oversized bloated zombie — clearly about 1.5x the height and width of a normal adult. Massive belly straining against a torn off-white hospital gown, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, dull empty stare.

Pose: WALK FRAME 2 of 4 — Both feet together at center, body raised 2 px upward (heavy mid-stride bob up — exaggerated for the tank's bulk), arms passing through neutral. The huge belly bobs up with the body. Up-bob passing pose between heavy strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_south_3.png

**Attach:** `style_anchor.png` + `tank_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A hugely oversized bloated zombie — clearly about 1.5x the height and width of a normal adult. Massive belly straining against a torn off-white hospital gown, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, dull empty stare.

Pose: WALK FRAME 3 of 4 — Left foot stepped forward, right foot back (mirror of frame 1). Heavy lumbering motion with the bulk shifting to the left this time, the belly swaying the other way. Body weight committed forward and slightly to the left. Arms swing — right arm slightly forward, left arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_south_4.png

**Attach:** `style_anchor.png` + `tank_idle.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing south, toward the camera — head at the top of its bounding box, feet at the bottom, full face visible from the front.

The zombie: A hugely oversized bloated zombie — clearly about 1.5x the height and width of a normal adult. Massive belly straining against a torn off-white hospital gown, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, dull empty stare.

Pose: WALK FRAME 4 of 4 — Both feet together at center, body lowered 2 px downward (heavy mid-stride bob down — exaggerated for the tank's bulk), arms passing through neutral. The huge belly bobs down with the body. Down-bob passing pose between heavy strides.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_east_1.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — the massive bulk in side profile, head turned to the right edge of the frame, only one shoulder closer to the viewer, half the face visible, the huge belly bulging out to one side. The leading edge of the body is on the right side.

The zombie: A hugely oversized bloated zombie. Massive belly, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, exposed rib on one side, dull empty stare.

Pose: WALK FRAME 1 of 4 (side profile) — Far leg striding forward to the east, close leg back to the west. Big visible side-profile stride, slow and heavy. The massive belly hangs and sways slightly. Arm farthest from camera swings forward, arm closest swings back. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_east_2.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — massive bulk in side profile, head turned to the right edge of the frame, half the face visible.

The zombie: A hugely oversized bloated zombie. Massive belly, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, dull empty stare.

Pose: WALK FRAME 2 of 4 (side profile) — Legs crossing through middle, body raised 2 px upward (heavy mid-stride bob up), arms passing through neutral. The huge belly bobs up. Up-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_east_3.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — massive bulk in side profile, head turned to the right edge of the frame, half the face visible.

The zombie: A hugely oversized bloated zombie. Massive belly, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, dull empty stare.

Pose: WALK FRAME 3 of 4 (side profile) — Close leg striding forward to the east, far leg back to the west (mirror of frame 1). Slow, heavy stride. The belly hangs and sways. Arm closest to camera swings forward, arm farthest swings back. Mid-stride peak.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_east_4.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing east as seen from above — massive bulk in side profile, head turned to the right edge of the frame, half the face visible.

The zombie: A hugely oversized bloated zombie. Massive belly, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, dull empty stare.

Pose: WALK FRAME 4 of 4 (side profile) — Legs crossing through middle, body lowered 2 px downward (heavy mid-stride bob down), arms passing through neutral. The huge belly bobs down. Down-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_north_1.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the head visible at the top of the frame, no face visible. The back of the gown and the tank's massive bulk seen from behind.

The zombie: A hugely oversized bloated zombie. Massive bulk, thick tree-trunk legs, bare meaty arms (back of arms visible), mottled purple-gray swollen skin with dark bruise patches on the back, exposed rib on one side, the back of the off-white hospital gown showing tears.

Pose: WALK FRAME 1 of 4 (back view) — Right foot stepped forward (toward the top), left foot back. Slow heavy lumbering shift to the right. Arms swing — left arm slightly forward, right arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_north_2.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the head visible at the top of the frame, no face visible.

The zombie: A hugely oversized bloated zombie. Massive bulk, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, the back of the off-white hospital gown.

Pose: WALK FRAME 2 of 4 (back view) — Both feet together at center, body raised 2 px upward (heavy mid-stride bob up), arms passing through neutral. Up-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_north_3.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the head visible at the top of the frame, no face visible.

The zombie: A hugely oversized bloated zombie. Massive bulk, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, the back of the off-white hospital gown.

Pose: WALK FRAME 3 of 4 (back view) — Left foot stepped forward (toward the top), right foot back (mirror of frame 1). Slow heavy lumbering shift to the left. Arms swing — right arm slightly forward, left arm slightly back.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_walk_north_4.png

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_walk_south_1.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact zombie character as the second reference image (the idle frame) and third reference image (the south-walk frame) — identical proportions, palette, silhouette, clothing, outline, and color scheme. Top-down pixel art, camera looking straight down at 90°. Transparent background. Render as a square image, the zombie centered and filling roughly 80% of the canvas with even transparent padding on all four sides.

The zombie is facing north, away from the camera — back of the head visible at the top of the frame, no face visible.

The zombie: A hugely oversized bloated zombie. Massive bulk, thick tree-trunk legs, bare meaty arms, mottled purple-gray swollen skin with dark bruise patches, the back of the off-white hospital gown.

Pose: WALK FRAME 4 of 4 (back view) — Both feet together at center, body lowered 2 px downward (heavy mid-stride bob down), arms passing through neutral. Down-bob passing pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# TANK — Attack Cycle (2 frames)

## tank_attack_1.png  (windup)

**Attach:** `style_anchor.png` + `tank_idle.png` + `tank_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (idle frame) and third reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A hugely oversized bloated zombie. Massive belly straining against a torn off-white hospital gown / stained butcher's apron, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, exposed rib on one side, dull empty stare, short thick neck.

Pose: WINDUP — the tank is hoisting both massive arms upward and back over its head, fists clenched, preparing the double-fisted ground-pound. Body weight loaded on the rear leg, torso leaning slightly back. Mouth opening into a roar. The huge belly is exposed as the arms rise. This is the moment just BEFORE the strike pose shown in the third reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## tank_attack_3.png  (recovery)

**Attach:** `style_anchor.png` + `tank_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (style anchor) exactly. Same exact zombie character as the second reference image (the peak strike pose) — identical proportions, palette, silhouette, clothing, outline. Top-down pixel art, camera looking straight down. The zombie is facing south, toward the camera. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

The zombie: A hugely oversized bloated zombie. Massive belly, thick tree-trunk legs, bare meaty arms with bulging muscles, mottled purple-gray swollen skin with dark bruise-like patches, exposed rib on one side, dull empty stare.

Pose: RECOVERY — both arms have already pounded the ground (in the second reference image) and are now pushing back up to standing. Hands at chest level, fists still clenched, torso straightening up, weight returning to both legs. The dust kicked up in the strike is visibly settling around the fists. Heavy, slow recovery. This is the moment just AFTER the strike in the reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# ENEMY ATTACK EXPANSION (8 frames)

## outpost_attack_1.png  (charge)

**Attach:** `style_anchor.png` + `outpost_idle.png` + `outpost_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact emplacement and soldier as the second reference image (idle) and third reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The rifle is pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: CHARGE — the soldier is bracing to fire. Rifle raised slightly higher than the idle position, shoulder pulled tightly into the rifle stock, body leaning slightly forward into the weapon, finger on trigger. NO muzzle flash yet — this is the half-second BEFORE the shot shown in the third reference image. Tension visible in the pose.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## outpost_attack_3.png  (recoil)

**Attach:** `style_anchor.png` + `outpost_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact emplacement and soldier as the second reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The rifle is pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: RECOIL — the soldier has just fired. Rifle muzzle pointed slightly higher than in the reference image (recoil tilt upward), shoulders pushed back from the recoil shock, body leaning back, the bright muzzle flash from the reference is now GONE — only a thin lingering wisp of pale gray smoke remains at the barrel tip. Settling back into stance.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## burst_attack_1.png  (charge)

**Attach:** `style_anchor.png` + `burst_idle.png` + `burst_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact emplacement and three soldiers as the second reference image (idle) and third reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The shotguns are pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: CHARGE — all three soldiers raising their pump-action shotguns simultaneously, weapons brought up to firing position, shoulders bracing into the stocks, fingers on triggers. NO muzzle flashes yet. This is the half-second BEFORE the synchronized blast shown in the third reference image. Coordinated tension across all three soldiers.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## burst_attack_3.png  (recoil)

**Attach:** `style_anchor.png` + `burst_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact emplacement and three soldiers as the second reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The shotguns are pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: RECOIL — all three soldiers have just fired. All three shotguns kicked upward by recoil, shoulders pushed back, the three muzzle blasts shown in the reference image are GONE — only thin lingering wisps of pale smoke remain at each of the three barrel tips. Three ejected red shotgun shells visible falling toward the ground (caught mid-air at lower height than in the reference, post-eject). Pump actions visibly back, ready to be cycled.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## sniper_attack_1.png  (aim)

**Attach:** `style_anchor.png` + `sniper_idle.png` + `sniper_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact sniper hide and prone soldier as the second reference image (idle) and third reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The rifle is pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: AIM — the prone soldier is fully braced into the rifle, scope pressed firmly to his eye, rifle absolutely steady, finger on trigger. The smallest possible body tension before firing. NO muzzle flash. This is the moment of perfect aim, just BEFORE the shot shown in the third reference image. Body completely still and locked into position.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## sniper_attack_3.png  (recoil)

**Attach:** `style_anchor.png` + `sniper_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact sniper hide and prone soldier as the second reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. The rifle is pointed south. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: RECOIL — the bolt-action has just fired. Heavy recoil — the prone soldier's body has slid back about one body-width, shoulders rotated back, rifle barrel kicked upward off the south aim line. Muzzle flash GONE — only thick gray smoke billowing from the barrel tip and a brass casing ejected mid-air. The bolt is visibly back in the cycled-open position.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## turret_attack_1.png  (charge)

**Attach:** `style_anchor.png` + `turret_idle.png` + `turret_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact turret as the second reference image (idle) and third reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: CHARGE — the turret's central barrel is spinning at full speed (rendered with motion-blur radial lines around the barrel), the status light at the base is now bright RED instead of green/dim. Twelve small bright spots are visible at the perimeter of the turret where the muzzle flashes are about to erupt — but no actual flashes yet, just hot orange "pre-flash" glow points spaced every 30 degrees. The hexagonal armor plates show heat-glow at the edges. This is the moment just BEFORE the radial blast shown in the third reference image.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## turret_attack_3.png  (settle)

**Attach:** `style_anchor.png` + `turret_attack_2.png`

```
Match the art style, palette, outline weight, and lighting of the first reference image (the style anchor) exactly. Same exact turret as the second reference image (the firing peak) — identical layout, proportions, colors, equipment, outline. Top-down pixel art, camera looking straight down. Transparent background. Render as a square image, subject centered, filling roughly 80% of the canvas with even transparent padding.

Pose: SETTLE — all twelve muzzle flashes from the reference image are GONE. In their place: twelve small thin gray smoke wisps drifting outward from where each flash was. The central barrel is slowing down (less motion-blur than the reference image). Status light fading from red back to a dim orange. Armor heat-glow dimming.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

# THEMED BARRIERS (24 frames)

## House (6)

### barrier_house_small_1.png  (Mailbox cluster — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above (camera looking straight down at 90°). Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding on all sides so the bounding box can be cleanly cropped. Single object, no background scenery, no ground texture, no shadow on the ground. The object is photographed from above as if abandoned in the world. Render as a square image.

Subject: A cluster of 3 American-style residential mailboxes mounted on a single weathered wooden post-and-rail. Different sizes and colors (one blue, one black, one cream-white), some with their flags up, one slightly rusted. Worn paint, scattered envelopes / junk mail at the base.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_house_small_2.png  (Overturned trash can — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A green plastic suburban trash can lying on its side, lid askew, garbage bags partially spilled out — a torn black bag, crumpled paper, a takeout container, banana peels. Dirty, weathered.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_house_medium_1.png  (Abandoned beige sedan — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width with even transparent padding above, below, and on both sides.

Subject: An abandoned 4-door beige sedan car seen from above. Mid-2000s family-car styling, dust-covered, slightly rusted, one front door ajar, windshield cracked. Tires partially flat. Roof visible with sunroof. The car is oriented horizontally, long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_house_medium_2.png  (Picket fence section — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width with even transparent padding.

Subject: A horizontal section of weathered white picket fence, roughly 8-10 pickets long, viewed from directly above. Several pickets broken or leaning, faded white paint with peeling sections, a few small bushes growing through the gaps. The fence runs horizontally across the frame, long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_house_large_1.png  (Yellow school bus — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio (slightly less wide than 16:9). The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned American yellow school bus seen from directly above. Long axis east-west, runs horizontally across the frame. Rectangular roof in faded school-bus yellow, black emergency hatch on top, "SCHOOL BUS" lettering peeking through faded paint, several windows visible along the sides. Dirty, dusty, one front tire visibly flat. Slightly rusted edges.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_house_large_2.png  (Parked moving truck — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned residential moving truck seen from directly above (think U-Haul style). Long axis east-west. Long boxy white cargo box at the rear with faded orange or red graphics, smaller cab at the front with windshield visible. Rear roll-up door partially open. Dust, weathered, one tire flat.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## Mall (6)

### barrier_mall_small_1.png  (Tangled shopping carts — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A tangled cluster of 4 silver wire shopping carts seen from directly above, jammed together at odd angles, wheels visible at the bottom of the carts, plastic flap-handles in red or blue. A few crumpled receipts and plastic bags caught in the wire.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_mall_small_2.png  (Stack of cardboard boxes — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A stacked pile of 5-6 cardboard shipping boxes of varying sizes, viewed from directly above. Brown cardboard with shipping tape, faded shipping labels, some boxes slightly crushed or sagging. Stacked unevenly in a roughly square footprint.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_mall_medium_1.png  (Abandoned hatchback — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned 4-door hatchback car (compact / economy size, smaller than a sedan) seen from directly above. Dark red or silver paint, dust-covered, both front doors closed, rear hatch slightly raised showing groceries / shopping bags spilled inside. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_mall_medium_2.png  (Vending machine row — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: A row of 3 vending machines seen from directly above, side by side. Visible from the top: rectangular roofs of each machine, brand-color tops (one red Coca-Cola style, one blue Pepsi-style, one white snack machine), one with a glowing top bezel, power cords trailing off one edge. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_mall_large_1.png  (White city transit bus — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned full-size white city transit bus seen from directly above. Long rectangular roof in white with a faded blue stripe along the sides, several roof vents and AC units, "TRANSIT" or route-number panel visible at the front, a few cracked side windows. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_mall_large_2.png  (Semi-trailer truck — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned semi-trailer truck seen from directly above. Long rectangular trailer roof in faded white or gray, separate cab at the front with windshield visible, the cab is shorter than the trailer. Some rust streaks running along the trailer roof. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## Hospital (6)

### barrier_hospital_small_1.png  (Biohazard waste bins — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A cluster of 3 red biohazard waste bins seen from directly above, side by side. Round red bins with the universal black-and-yellow biohazard symbol painted on top of each lid, one lid askew, used medical waste partially visible inside. Worn, slightly stained.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_hospital_small_2.png  (IV stand cluster — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A cluster of 3 metal IV drip stands seen from directly above. Each is a thin vertical pole on a 4-wheeled base with hooks at the top from which empty IV bags hang. Stands are leaning against each other, some bags torn, plastic tubing tangled.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_hospital_medium_1.png  (Hospital gurney — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: A wheeled hospital gurney seen from directly above, abandoned in the open position. Pale blue or white sheet draped over the mattress, side rails up, IV pole attached at one end with an empty bag hanging. Wheels visible at the four corners. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_hospital_medium_2.png  (Hospital bed — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: A full hospital bed seen from directly above, abandoned. Adjustable mattress with rumpled white sheets and a pillow at one end, side rails partially raised, a small tray-table extended over the bed at the foot end, monitor cables draped across. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_hospital_large_1.png  (Ambulance — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned standard ambulance seen from directly above. Long boxy rear cargo unit (the patient-care module) with a large red cross painted on top of the roof, a bar of light/siren equipment at the front of the cargo unit roof, the cab at the front with windshield visible. Rear doors open. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_hospital_large_2.png  (Mobile medical unit trailer — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: A long mobile medical unit trailer seen from directly above (think emergency response trailer or temporary clinic). Long rectangular roof in white with red-cross markings and "MEDICAL" lettering visible, AC units on top, a small rear ramp or step deployed. No cab — just the trailer. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

## Military (6)

### barrier_military_small_1.png  (Sandbag pile — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A small fortification of 8-10 olive-canvas sandbags stacked into a roughly square mound, viewed from directly above. Individual bag outlines visible, slight bulges and weight settling between bags, some dust on top.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_military_small_2.png  (Stacked fuel barrels — 1024×1024 square)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Subject centered, filling roughly 80% of the canvas with even transparent padding. Single object, no scenery, no ground texture, no ground shadow. Render as a square image.

Subject: A cluster of 4 olive-drab military fuel barrels seen from directly above. Each barrel is a circular metal drum with a small filler cap at the top center, rust patches around the rims, faded yellow "FLAMMABLE" stencil markings on the tops of one or two of them.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_military_medium_1.png  (Olive-drab Humvee — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned olive-drab military Humvee (HMMWV) seen from directly above. Boxy rectangular roof with a single roof hatch, antenna mast at one corner, dust-covered, distinct military silhouette. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_military_medium_2.png  (Camo supply crates — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 4:3 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: A row of 4 stacked military supply crates in olive-drab and brown camouflage paint, seen from directly above. Each crate is a sturdy rectangular wooden box with rope handles and faded white stenciled markings on top ("AMMO", "RATIONS", "MEDICAL"). Stacked in a row, long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_military_large_1.png  (Main battle tank — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned olive-drab main battle tank seen from directly above. Wide rectangular hull with the distinctive turret offset slightly toward the front-center, the long main cannon barrel pointing forward (eastward in the frame), tracks visible along the sides of the hull. Some dust and small camo netting patches on the turret. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

### barrier_military_large_2.png  (Armored personnel carrier — 1536×1024 landscape)

**Attach:** `style_anchor.png`

```
Match the art style, palette, outline weight, and lighting of the reference image exactly. Top-down pixel art view from directly above. Transparent background. Single object, no scenery, no ground texture, no ground shadow. Render as a landscape image, roughly 12:7 aspect ratio. The object runs horizontally across the central 80% of the frame width.

Subject: An abandoned olive-drab armored personnel carrier (APC) seen from directly above. Long rectangular hull with a small turret near the front carrying a heavy machine gun (much smaller than a tank's cannon), tracks or large wheels visible along the sides, a rear hatch at one end. Long axis east-west.

IMPORTANT: I will downscale this image in Photoshop using nearest-neighbor sampling to a much smaller size for use as a game sprite. Produce crisp, high-contrast detail with clear silhouettes and bold flat colors. Avoid soft anti-aliased edges, blurry shading, fine gradients, or thin spindly details — they turn to mush at the target size. Treat this as "chunky pixel art": fewer details, but every detail must be unambiguously readable.
```

---

## When done

Drop everything in `Z_Attack/Assets/` using the exact filenames above. Then ping me — Task 2 implementation will reference these names directly.
