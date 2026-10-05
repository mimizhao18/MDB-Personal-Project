# F1 Focus

A mobile focus-timer app with a Formula 1 theme. You pick a race length in laps, a car drives around a real circuit while you focus, and you earn XP and credits to spend on your car.

Built with Expo (React Native) and TypeScript. Runs on a phone through Expo Go.

**Status:** version 1 is complete (all 10 build steps), plus the race-length slider and the Monaco and Spa tracks. See [BACKLOG.md](BACKLOG.md) for what comes next.

## Running the app

Requirements: Node.js, the **Expo Go** app on your phone, and a free Expo account (Expo Go asks you to sign in). The phone and computer must be on the same Wi-Fi.

```bash
npm install
npx expo start
```

Scan the QR code with your phone. Leave the server running while you work: saving a file updates the phone within a second or two. Restart with `npx expo start --clear` after installing packages or changing `app.json`.

### Running in a web browser (for presenting on a screen)

The same app runs in a desktop browser, shown as a phone-sized column in the middle of the page:

```bash
npx expo start --web
```

It opens at http://localhost:8081. Data is saved in the browser's own storage, so open **Settings > Load demo data** once to fill it with example races. Browser dialogs replace the phone's pop-up alerts (`src/ui/alert.ts`). This is meant for demos; the phone app is the real target.

Useful commands:

| Command | What it does |
|---|---|
| `npm run check` | Runs the automated rule tests (laps, rewards, streaks, car position, garage, history) |
| `npx tsc --noEmit` | Typecheck |
| `npx expo lint` | Lint |
| `npx expo install <package>` | Add a package (always use this, not `npm install`, so versions match the Expo SDK) |

Run the typecheck and lint before calling any change done (required by `AGENTS.md`).

## How it works

### The race
- You choose a track and a number of **whole laps**. Focus time is always `laps x lap time`, so laps are never fractional.
- Every track has one fixed **lap time**: the real lap record rounded to the nearest 10 seconds. Silverstone's record is 1:27.097, so one lap takes **90 s**. A 10-lap race is 15 minutes; the full 52-lap race is 78 minutes.
- Distance = completed laps x the track's lap length (Silverstone: 5.891 km).
- You can **pause** at any time. **End early** is only offered (and only allowed by the timer) while paused.
- A race shorter than **1 minute** earns nothing and is not saved.

### Rewards
- **1 XP and 1 credit per full minute focused.** Ending early still pays for the time you focused.
- **Levels:** level n needs `50 x (n-1)^2` total XP (level 2 at 50 XP, level 3 at 200, level 4 at 450, ...).
- **Streak:** consecutive calendar days with at least one counted race. Same day keeps it, the next day extends it, a missed day resets it to 1. The displayed streak drops to 0 once a whole day has been missed.
- These numbers are placeholders (see the backlog).

### The garage
- Spend credits on **liveries**: ready-made car designs, like skins. There are 5 (Scarlet is free; Cobalt 50, Papaya 100, Emerald 150, Obsidian 250 credits, placeholder prices).
- A livery is just data in `src/data/liveries.ts`: a stable id, name, price, body color, accent color and a **pattern** (`stripe`, `split` or `chevron`). The car drawing builds the look from it, so redrawing the car updates every livery at once. Add a livery by adding one entry. Never rename or reuse an id, because players' saves refer to it.
- Tap any livery, owned or not, to **preview it on the big car**. A button under the car then says Equipped, Equip, or Buy for N credits (it shows how many more credits you need if you can't afford it yet).
- Liveries are original designs, not real teams' colors or logos.
- The race number (1 to 99) is free and shows on the rear wing.
- The car has two levels of detail (`src/components/CarIcon.tsx`): `simple` for the small car on the track and `full` for Home and the garage.

### Saved data
Everything is stored **on the phone only**, using AsyncStorage (no accounts, no server):
- `profile.v1`: total XP, credits, streak, owned liveries, and the car (livery id and race number).
- `sessions.v1`: the list of finished races.

Older saved profiles are upgraded automatically when fields change (`src/logic/profileMigration.ts`); for example, saves from the paint-color days keep their XP, credits and streak and get the default livery. **Settings > Reset all data** wipes both.

## Screens

| Screen | File | Purpose |
|---|---|---|
| Home | `src/app/index.tsx` | Level and XP bar, credits, your car, stats, Start Race, links to History, Settings and the garage |
| New Race | `src/app/create-session.tsx` | Pick one of the three tracks and set the race length with a slider that toggles between **laps** and **minutes** (minutes snap to whole laps). In development builds it also has a **Test speed** row (10x/30x/60x) so races finish quickly |
| Race | `src/app/session.tsx` | Live race: track with the moving car, lap counter, time remaining, pause/resume/end. Saves the race when it ends |
| Summary | `src/app/summary.tsx` | Laps, time, distance, XP and credits earned, level progress, streak |
| History | `src/app/history.tsx` | Current and longest streak, last-7-days chart, list of past races |
| Garage | `src/app/garage.tsx` | Buy and equip liveries, change race number |
| Settings | `src/app/settings.tsx` | Reset all data. In development builds also **Load demo data**: replaces everything with a week of example races (191 XP, 141 credits, a 5-day streak, the Cobalt livery owned) so the app looks lived-in for demos; one 15-minute race then triggers a level-up |

Navigation uses **Expo Router** (file-based): every file in `src/app/` is a screen, and `_layout.tsx` defines the navigation stack.

## Code layout

```
src/
  app/          Screens (Expo Router)
  components/   CarIcon.tsx (the car drawing), TrackView.tsx (track + moving car), Slider.tsx (race-length slider)
  data/         tracks/ (track definitions and shapes), cosmetics.ts (paint colors)
  hooks/        useSessionTimer.ts (the race clock)
  logic/        Pure functions: no screens, no storage, easy to test
  models/       types.ts (Track, Session, PlayerProfile, CarSettings)
  storage/      Reading and writing saved data
  theme.ts      Colors and spacing
scripts/        check-rules.ts (automated tests) and helpers
tools/          trace_track.py (turns an F1 track graphic into a track shape file)
```

Design rule: **rules live in `src/logic/`** as plain functions, and screens only display them. That is why the rules can be tested without a phone.

### Key modules
- `logic/rewards.ts`: laps/time/distance conversions, XP and credits, levels, building a saved session record.
- `logic/lapProgress.ts`: turns "planned laps + elapsed seconds" into current lap, completed laps and how far through the lap (0 to 1).
- `logic/trackPosition.ts`: turns a lap fraction into the car's position and heading on the track, using a smooth curve through the traced points so turning is not jerky.
- `logic/raceLength.ts`: converts between laps and minutes for the race-length slider (always whole laps).
- `logic/streak.ts`, `logic/history.ts`, `logic/stats.ts`, `logic/garage.ts`, `logic/sessionOptions.ts`: streaks, the weekly chart, lifetime totals, buying and equipping, formatting.
- `hooks/useSessionTimer.ts`: the race clock (idle, running, paused, finished, ended). Elapsed time comes from the real clock, not counted ticks, so it stays correct if the app is throttled. Updates once per screen frame for smooth motion.
- `storage/`: `storage.ts` wraps AsyncStorage and falls back to defaults if data is missing or corrupt; `profile.ts` and `sessions.ts` hold the profile and race list; `sessions.ts > recordSession` saves a race and adds its rewards to the profile.

## Design system and the design lab

- **Design values** live in `src/design/tokens.ts` (colors, spacing, corner radius, text styles) and are read by every screen through `useTheme()`. Styles that depend on them are declared with `makeStyles` (`src/design/DesignProvider.tsx`). Shared building blocks (buttons, cards, section labels, stat tiles, progress bars, segmented controls) are in `src/ui/kit.tsx`, so screens look consistent.
- **Look:** dark and minimal, fixed F1 red accent, hairline borders, slightly rounded corners (4 to 6 px by default, so it is clean but not harsh), small uppercase section labels.
- **Design lab (development only):** tap the **Design** tab on the right edge of any screen to open a panel that changes the whole app live and remembers the choice. Options: **corners** (sharp, subtle, soft), **spacing** (compact, comfortable, roomy), **Home layout** (hub, cards, dashboard) and **navigation** (small links or a bottom tab bar). Defaults are subtle, comfortable, hub and links. The design lab and its stored settings are not part of a release build.
- To add a design option: add it to `DesignSettings` and `DESIGN_OPTIONS` in `tokens.ts`, use it in `buildTheme` or a screen, and add a row in `src/design/DesignLab.tsx`.

## Tracks

Three circuits: **Silverstone**, **Monaco** and **Spa-Francorchamps**. Each track (`src/data/tracks/`) has its real lap count and length, the app lap time, and a **traced shape**.

| Track | Race laps | Lap length | Lap record used | App lap time | Full race |
|---|---|---|---|---|---|
| Silverstone | 52 | 5.891 km | 1:27.097 | 90 s | 78 min |
| Monaco | 78 | 3.337 km | 1:12.909 | 70 s | 91 min |
| Spa-Francorchamps | 44 | 7.004 km | 1:44.701 | 100 s | 73 min |

- Facts and the circuit graphic come from each race's page on formula1.com. The app lap time is the lap record rounded to the nearest 10 s.
- Each `<track>Shape.ts` holds an SVG path, 360 points spaced evenly by distance along one lap (point `i` is `i/360` of a lap, starting at the start/finish line and running in race direction), the start/finish line, the drawing box (1000 wide) and the road width.
- Shapes are generated by **`tools/trace_track.py`** from the track image in `reference/` (the downloaded F1 graphics, **not in git** because they are F1's copyrighted artwork). The same pipeline is used for every track: extract a mask, skeletonize to a centerline, chain the pieces into a loop, fit a smooth curve, resample to 360 points. Silverstone traces the road outline; Monaco and Spa trace the thin colored center line, because on Monaco the road outlines fuse together. See the docstring at the top of the script. Needs `pip install -r tools/requirements.txt`.
- Road width is per track (26 units, 14 on Monaco where two strands run only about 25 units apart). The car and start line are scaled to match.
- Adding a track: download its detailed graphic to `reference/<id>.webp`, add an entry to `CONFIGS` in the tracing tool (start/finish pixel, a point just after the line to set the direction, road width), run `python tools/trace_track.py <id>`, check the overlay with `--debug-dir`, then add a track file and register it in `src/data/tracks/index.ts` and the `TrackId` type.

## Testing

`npm run check` runs `scripts/check-rules.ts`, which covers lap and time math, rewards, levels, streak edge cases (month and year boundaries, gaps), lap progress, car position and heading smoothness, the garage, lifetime stats, and the weekly history. Screens are checked by hand on the phone.

## Decisions and history

- **One race pace for v1:** a fixed lap time per track (record rounded to 10 s).
- **Focus time is a whole number of laps**, chosen by you, rather than a time split into fractional laps.
- **Rewards follow focus time, not laps**, so ending early is still paid for the time focused.
- **Everything local:** friends, leaderboards and shared sessions need a backend and are future work.
- Build order followed: project setup, data model, timer and lap logic, track and car animation, create-session screen, live race screen, summary, real Home, garage, history. Each step is one git commit (`git log --oneline`).

## Known issues and next steps

See [BACKLOG.md](BACKLOG.md): UI design pass, XP and credit balance, car design, keeping the screen awake during a race, and the longer-term multiplayer and distraction-blocking ideas.

Expo projects change quickly between releases, so `AGENTS.md` tells coding assistants to check the current Expo docs for the installed SDK before using any Expo API.
