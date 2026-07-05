## Vibe
- Bristol Underground × Analog Archive: dark editorial sensibility of 90s UK underground zines, low-light photographic grain, Portishead's Dummy monochrome blues, dub vinyl aesthetics, Xerox degradation, and CRT phosphor glow.

## Color
- Primary: #1A3A5C
- On Primary: #C8D8E8
- Accent: #2A6FAD
- On Accent: #E8F0F8
- Background: #060B12
- Foreground: #B8C8D4
- Muted: #0E1A26
- Border: #1C3045
- Secondary: #0D2035

## Typography
- Heading: Space Mono (family: 'Space Mono', monospace, weight: 700, url: https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap)
- Body: Space Mono (family: 'Space Mono', monospace, weight: 400, url: https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap)

## Visual Language
- Core visual signature: film-grain noise texture overlay via CSS SVG filter + pseudo-element, CRT scanlines via repeating-linear-gradient, blue monochrome image treatment using CSS mix-blend-mode and sepia+hue-rotate+saturate filters
- Material & depth: deep blue-black backgrounds, glow shadows using box-shadow with #2A6FAD opacity, no flat white cards — surfaces use Muted (#0E1A26) with thin Border (#1C3045) edges
- Containers & buttons: sharp-cornered containers with 1px border in Border color, buttons use transparent fill with Accent border and On Accent text, hover triggers blue glow; nodes rendered as circles on canvas
- Layout rhythm: full-viewport canvas as primary surface, overlaid UI panels slide in from edges, sparse type labels float on dark space, all density concentrated in panels

## Animation
- Entrance: archival panels slide up with opacity fade over 400ms ease-out
- Interaction: node hover triggers blue glow pulse and scale 1.1x over 200ms; influence lines animate stroke-dashoffset on hover
- Scroll / transition: timeline scrubber position triggers canvas viewport translation with 600ms inertial ease; VHS glitch flash on panel open (brief horizontal displacement 2px over 80ms)

## Forbidden
- White or light backgrounds anywhere on the canvas
- Rounded pill buttons or soft card shadows (breaks Brutalist archive feel)
- Any Spotify/SaaS gradient cards or feature grid layouts

## Additional Notes
- All user-visible copy in English
- Grain overlay: use a fixed pseudo-element with SVG turbulence filter at 3–5% opacity across the entire viewport
- CRT scanlines: repeating-linear-gradient horizontal lines at 2px interval, 2% opacity
- Blue monochrome image processing: CSS filter chain — grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(300%) brightness(0.7)
- Node influence lines: drawn on canvas with dashed strokes in Accent color at 30% opacity