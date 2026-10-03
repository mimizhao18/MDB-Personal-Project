# Backlog: things to change or add later

# Decisions for you (nothing is built until you decide)

Answer these whenever you have time. Short answers are fine; "your call" is a valid answer for any of them.

## Rewards and levels (`src/logic/rewards.ts`, `src/data/cosmetics.ts`)
1. **Earning rate.** Now: 1 XP and 1 credit per focused minute. A 25-minute race = 25 XP. Is that the right pace, or should credits and XP differ (for example more credits for finishing)?
2. **Finishing bonus.** Should finishing the full race pay extra over ending early? (Ending early now pays only for time focused.)
3. **Level curve.** Now: level n needs 50 x (n-1)^2 XP (level 2 at 50, level 5 at 800). How many hours of focus should level 10 take?
4. **What levels do.** Right now a level is just a number. Should levels unlock things (colors, tracks, car parts)?
5. **Prices.** Colors cost 50 to 300 credits. How long should the most expensive thing take to earn?
6. **Streak rewards.** Should a streak give bonus XP or credits?

## Car design (`src/components/CarIcon.tsx`)
1. **Look.** The car is now a cleaner top-down F1 shape. The end goal is a clean, close-to-real F1 car on Home and in the garage. How far should it go: stay as drawn vector art, or use a detailed illustration or image?
2. **Customization.** Colors and number only for now. Add liveries (stripes, patterns), helmet color, wheel rims, sponsors?

## Race length (`src/app/create-session.tsx`)
1. Anything to change about the laps/minutes slider? For example presets like 25/45/60 minutes, remembering your last choice, or a "full race" button.

## UI design (all screens)
1. **Overall feel.** Dark only (now), or light mode too?
2. **Brand.** Does the app have a name and logo yet? (Home says nothing right now.)
3. **Tone and details.** Fonts, animations, sounds, and haptics on race events.


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
