# F1 Focus

A mobile focus-timer app with a Formula 1 theme. You pick a race length in laps, a car drives around a real circuit while you focus, and you earn XP and credits to spend on your car.

Built with Expo (React Native) and TypeScript. Runs on a phone through Expo Go.

**Status:** version 1 is complete (all 10 build steps). See [BACKLOG.md](BACKLOG.md) for what comes next.

## Running the app

Requirements: Node.js, the **Expo Go** app on your phone, and a free Expo account (Expo Go asks you to sign in). The phone and computer must be on the same Wi-Fi.

```bash
npm install
npx expo start
```

Scan the QR code with your phone. Leave the server running while you work: saving a file updates the phone within a second or two. Restart with `npx expo start --clear` after installing packages or changing `app.json`.

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
- Spend credits on paint colors, used for the car body and accent. Two are free (Racing Red, White); the rest cost 50 to 300 credits.
- Changing the race number (1 to 99) is free.
- Colors are defined in `src/data/cosmetics.ts`.

### Saved data
Everything is stored **on the phone only**, using AsyncStorage (no accounts, no server):
- `profile.v1`: total XP, credits, streak, unlocked colors, car look.
- `sessions.v1`: the list of finished races.

Older saved profiles are upgraded automatically when new fields are added. **Settings > Reset all data** wipes both.

## Screens

| Screen | File | Purpose |
|---|---|---|
| Home | `src/app/index.tsx` | Level and XP bar, credits, your car, stats, Start Race, links to History, Settings and the garage |
| New Race | `src/app/create-session.tsx` | Pick the track and race length. In development builds it also has a **Test speed** row (10x/30x/60x) so races finish quickly |
| Race | `src/app/session.tsx` | Live race: track with the moving car, lap counter, time remaining, pause/resume/end. Saves the race when it ends |
| Summary | `src/app/summary.tsx` | Laps, time, distance, XP and credits earned, level progress, streak |
| History | `src/app/history.tsx` | Current and longest streak, last-7-days chart, list of past races |
| Garage | `src/app/garage.tsx` | Buy and equip colors, change race number |
| Settings | `src/app/settings.tsx` | Reset all data |

Navigation uses **Expo Router** (file-based): every file in `src/app/` is a screen, and `_layout.tsx` defines the navigation stack.

## Code layout

```
src/
  app/          Screens (Expo Router)
  components/   CarIcon.tsx (the car drawing), TrackView.tsx (track + moving car)
  data/         tracks/ (track definitions and shapes), cosmetics.ts (paint colors)
  hooks/        useSessionTimer.ts (the race clock)
  logic/        Pure functions: no screens, no storage, easy to test
  models/       types.ts (Track, Session, PlayerProfile, CarSettings)
  storage/      Reading and writing saved data
  theme.ts      Colors and spacing
scripts/        check-rules.ts (automated tests) and helpers
```

Design rule: **rules live in `src/logic/`** as plain functions, and screens only display them. That is why the rules can be tested without a phone.

### Key modules
- `logic/rewards.ts`: laps/time/distance conversions, XP and credits, levels, building a saved session record.
- `logic/lapProgress.ts`: turns "planned laps + elapsed seconds" into current lap, completed laps and how far through the lap (0 to 1).
- `logic/trackPosition.ts`: turns a lap fraction into the car's position and heading on the track, using a smooth curve through the traced points so turning is not jerky.
- `logic/streak.ts`, `logic/history.ts`, `logic/stats.ts`, `logic/garage.ts`, `logic/sessionOptions.ts`: streaks, the weekly chart, lifetime totals, buying and equipping, race length options.
- `hooks/useSessionTimer.ts`: the race clock (idle, running, paused, finished, ended). Elapsed time comes from the real clock, not counted ticks, so it stays correct if the app is throttled. Updates once per screen frame for smooth motion.
- `storage/`: `storage.ts` wraps AsyncStorage and falls back to defaults if data is missing or corrupt; `profile.ts` and `sessions.ts` hold the profile and race list; `sessions.ts > recordSession` saves a race and adds its rewards to the profile.

## Tracks

Only **Silverstone** exists so far. Each track (`src/data/tracks/`) has its real lap count and length, the app lap time, and a **traced shape**:
- `silverstoneShape.ts` holds an SVG path, 360 points spaced evenly by distance along one lap (point `i` is `i/360` of a lap, starting at the start/finish line and running in race direction), the start/finish line, and the drawing box (1000 wide).
- The shape was traced from the circuit graphic on the official Formula 1 website (centerline only), lightly smoothed. The downloaded image is kept in `reference/`, which is **not in git** because it is F1's copyrighted artwork.
- Adding a track means: get its facts and graphic, trace the centerline the same way, create a shape file and a track file, and add it to `src/data/tracks/index.ts`. The trace scripts were temporary and are not in the repo yet; see the backlog.

## Testing

`npm run check` runs `scripts/check-rules.ts`, which covers lap and time math, rewards, levels, streak edge cases (month and year boundaries, gaps), lap progress, car position and heading smoothness, the garage, lifetime stats, and the weekly history. Screens are checked by hand on the phone.

## Decisions and history

- **One race pace for v1:** a fixed lap time per track (record rounded to 10 s).
- **Focus time is a whole number of laps**, chosen by you, rather than a time split into fractional laps.
- **Rewards follow focus time, not laps**, so ending early is still paid for the time focused.
- **Everything local:** friends, leaderboards and shared sessions need a backend and are future work.
- Build order followed: project setup, data model, timer and lap logic, track and car animation, create-session screen, live race screen, summary, real Home, garage, history. Each step is one git commit (`git log --oneline`).

## Known issues and next steps

See [BACKLOG.md](BACKLOG.md): UI design pass, XP and credit balance, car design, a laps/minutes slider for race length, more tracks (Monaco, Spa), keeping the screen awake during a race, and the longer-term multiplayer and distraction-blocking ideas.

Expo projects change quickly between releases, so `AGENTS.md` tells coding assistants to check the current Expo docs for the installed SDK before using any Expo API.
