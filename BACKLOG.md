# Backlog: things to change or add later

## From the v1 build (your list)
- **UI design for everything.** Current screens are a functional first pass (colors, spacing, typography, icons, animations).
- **XP levels and credit system.** Current rules are placeholders: 1 XP and 1 credit per focused minute, level n needs 50 x (n-1)^2 XP. All in `src/logic/rewards.ts`. Prices in the garage need rebalancing against this too.
- **Car design.** The car is a simple top-down shape in `src/components/CarIcon.tsx`. Needs a better look, liveries and more customization.

## Known gaps and loose ends
- **More tracks.** Silverstone, Monaco and Spa exist. More can be added with `tools/trace_track.py` (see README). Lap time rule: lap record rounded to the nearest 10 s.
- **Spa lap record.** The F1 page lists 1:44.701 (Perez, 2024), which gives 100 s per lap. Worth double-checking against another source, since the long-standing race lap record is often quoted as 1:46.286 (110 s).
- **Monaco hairpin.** The turn 5-7 section is simplified by the tracing; hand-tune if it looks wrong.
- **Track shape.** Lightly smoothed trace; tight corners may still look slightly rough. Could be hand-tuned.
- **Keep the screen awake during a race.** `expo-keep-awake` would not install (peer dependency conflict in Expo's optional packages). The timer stays correct without it, but the phone may dim or sleep.
- **Package install conflict.** `expo-keep-awake` and `@react-native-community/slider` both fail to install because npm cannot resolve optional peer dependencies in Expo's tree (`react-native-worklets`, `react-dom`). The race-length slider is therefore a small custom component (`src/components/Slider.tsx`). Worth fixing the root cause, for example by pinning those peers, before adding more packages.
- **Test speed in development.** Races run at 10x/30x/60x add real XP and credits to the profile. Use Settings > Reset all data to clear them.
- **Expo patch update.** `expo` is one patch behind (57.0.25 vs 57.0.26). Harmless; fix with `npx expo install expo@~57.0.26` when convenient.
- **Desktop notifications** from Claude when a task finishes were not arriving. Check Windows notification settings (Claude allowed, Do not disturb off).
- **Sessions under 1 minute** earn nothing and are not saved.

## Later features (from the original idea)
- Friends, leaderboards and joint sessions (needs a backend).
- Distraction warnings (yellow flag, virtual safety car, crash), notification blocking.
- Pit stops and tire strategy, race engineer messages.
- Weather effects.
- Post-session lap mini-game.
- Reward ideas: liveries, unlockable tracks.
