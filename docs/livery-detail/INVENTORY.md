# Livery inventory

Everything the 42 liveries painted before this pass, counted from the livery files (`src/data/liveries/*.ts`) on
tag `pre-livery-detail`. This is the work list for the logo library (src/data/logos) and the rebuild.

## How everything was drawn before

- **Every sponsor, wordmark and number** was a line of the bold stroke font (`strokeFont.ts`): capitals made of round-ended
  strokes, one weight, no slant, no outline. Lower case was drawn as capitals. No livery used the old pixel font.
- **Every roundel, badge and emblem** (the Shell shell, the Ferrari shield, the BMW and Vodafone roundels, the Red Bull bulls)
  was an `ellipse()` polygon of 20 points with the name written over it.
- **Every stripe, fade, swoosh and panel** was a straight-edged polygon in one flat color (no curves, no gradients, no outlines).

## Decorations

| Decoration | Liveries | Drawn with before |
|---|---|---|
| Flat color panels (nose caps, engine cover flanks, sidepod bands, lower-body bands) | all 42 | straight polygons (`stripe`, `flank`, `podBand`, `noseCapShape`, `coverFlank`, `lowerPod`) |
| Roundels and badges (Shell, Vodafone, Lucky Strike, BMW, Red Bull bulls, Ferrari shield, Mercedes stars, Audi ring) | 30 (48 `ellipse()` uses) | 20-point ellipse polygons |
| Swooshes and sweeps (Mercedes teal, McLaren blue, Aston lime line, Toyota brush, Benetton streaks) | 12 | 4 to 12 point polygons |
| Cooling grilles / louvres | 4 (2022) | `grille()`: black box with grey bars |
| Racing stripes (Martini) | 1 | three nested rectangles |
| Pinstripes (JPS gold, Lotus E22 gold) | 2 | thin rectangles |
| Chrome / silver (McLaren 2004 and 2014, Mercedes 2014 and 2022) | 4 | a flat grey `primary` |
| Fades (Mercedes 2026 stars, Cadillac 2026 chequer fade) | 2 | a few grey rectangles and circles |
| Checks | 0 | `checker()` exists but no livery uses it |
| Italian flag (Ferrari 2022) | 1 | three rectangles |
| Wing-top stripes | 3 | `wingTop` rectangles |

## Numbers

| Number | Liveries | Largest (m) | Drawn with before |
|---|---|---|---|
| 12 | mclaren-1980s,lotus-1980s,lotuscamel-1980s | 0.12 | stroke font |
| 5 | williams-1980s,brabham-1980s,mclaren-2004 | 0.1 | stroke font |
| 1 | ferrari-2004,redbull-2014 | 0.09 | stroke font |
| 8 | renault-2004,renault-2014 | 0.07 | stroke font |
| 20 | benetton-1980s | 0.12 | stroke font |
| 44 | mercedes-2014 | 0.1 | stroke font |
| 28 | ferrari-1980s | 0.09 | stroke font |
| 11 | forceindia-2014 | 0.09 | stroke font |
| 22 | mclaren-2014 | 0.08 | stroke font |
| 19 | williams-2014 | 0.08 | stroke font |
| 3 | williams-2004 | 0.07 | stroke font |
| 9 | bar-2004 | 0.07 | stroke font |
| 17 | toyota-2004 | 0.07 | stroke font |
| 7 | ferrari-2014 | 0.07 | stroke font |
| 14 | jaguar-2004 | 0.06 | stroke font |

## Sponsors and team marks

Sorted by how many liveries use the name, then by its largest size on the car. "Uses" counts every place it is painted
(side, top, wings, end plates). All were stroke-font lettering before. The last column is what the real mark needs beyond lettering.

| Name | Liveries | Uses | Largest (m) | Used on | Real mark (beyond lettering) |
|---|---|---|---|---|---|
| MOBIL 1 | 6 | 14 | 0.07 | williams-1980s, mclaren-2004, mclaren-2014, redbull-2022, redbull-2026, racingbulls-2026 | Mobil with red o, and the 1 |
| SHELL | 5 | 8 | 0.09 | mclaren-1980s, ferrari-2004, ferrari-2014, ferrari-2022, ferrari-2026 | scalloped pecten (red/yellow), V-POWER wordmark separately |
| HONDA | 5 | 10 | 0.08 | mclaren-1980s, williams-1980s, lotuscamel-1980s, bar-2004, astonmartin-2026 | H in a rounded trapezoid (wordmark on the 80s/2004 cars) |
| RICHARD MILLE | 5 | 5 | 0.035 | renault-2014, ferrari-2022, mclaren-2022, ferrari-2026, mclaren-2026 | small wordmark |
| V-POWER | 4 | 7 | 0.07 | ferrari-2004, ferrari-2014, ferrari-2022, ferrari-2026 |  |
| RENAULT | 4 | 6 | 0.055 | lotus-1980s, renault-2004, redbull-2014, renault-2014 | the diamond (lozenge) and wordmark |
| RED BULL | 4 | 7 | 0.055 | redbull-2014, redbull-2022, redbull-2026, racingbulls-2026 | two charging bulls and a yellow sun, wordmark |
| MICHELIN | 4 | 6 | 0.05 | renault-2004, bar-2004, jaguar-2004, toyota-2004 | italic wordmark (Bibendum left out) |
| ELF | 3 | 6 | 0.1 | lotus-1980s, lotuscamel-1980s, renault-2004 | red/blue triangle-shaped wordmark |
| PETRONAS | 3 | 15 | 0.09 | mercedes-2014, mercedes-2022, mercedes-2026 | wide wordmark (teal) |
| MARLBORO | 3 | 8 | 0.08 | ferrari-1980s, mclaren-1980s, ferrari-2004 | the red chevron "roof" and serif wordmark |
| GOODYEAR | 3 | 6 | 0.07 | ferrari-1980s, mclaren-1980s, lotus-1980s | the winged foot between GOOD and YEAR |
| BOSS | 3 | 3 | 0.07 | mclaren-2004, astonmartin-2022, astonmartin-2026 |  |
| CASTROL | 3 | 4 | 0.06 | brabham-1980s, williams-2004, alpine-2022 | the red/green ribbon wordmark |
| SANTANDER | 3 | 12 | 0.06 | ferrari-2014, mclaren-2014, ferrari-2022 | the red flame and wordmark |
| FIAT | 3 | 3 | 0.05 | ferrari-1980s, ferrari-2004, ferrari-2014 | the four slanted bars wordmark (80s) / shield (2004/14) |
| AMD | 3 | 3 | 0.05 | ferrari-2004, mercedes-2022, mercedes-2026 |  |
| IWC | 3 | 3 | 0.05 | mercedes-2014, mercedes-2022, mercedes-2026 |  |
| MICROSOFT | 3 | 7 | 0.05 | renault-2014, alpine-2022, mercedes-2026 |  |
| HAAS | 2 | 10 | 0.16 | haas-2022, haas-2026 | heavy red italic wordmark |
| HP | 2 | 5 | 0.15 | williams-2004, ferrari-2026 | blue disc with italic hp |
| BWT | 2 | 12 | 0.15 | alpine-2022, alpine-2026 | heavy rounded wordmark |
| ORACLE | 2 | 2 | 0.14 | redbull-2022, redbull-2026 | wide wordmark |
| COGNIZANT | 2 | 4 | 0.1 | astonmartin-2022, astonmartin-2026 |  |
| ARAMCO | 2 | 10 | 0.1 | astonmartin-2022, astonmartin-2026 | blue/green wordmark with the star mark |
| ESSO | 2 | 3 | 0.08 | toyota-2004, redbull-2022 | the oval with red letters |
| PDVSA | 2 | 5 | 0.08 | renault-2014, williams-2014 |  |
| DE LONGHI | 2 | 2 | 0.075 | lotus-1980s, lotuscamel-1980s |  |
| CEVA | 2 | 2 | 0.075 | ferrari-2022, ferrari-2026 |  |
| BMW | 2 | 3 | 0.07 | benetton-1980s, brabham-1980s | the quartered roundel |
| TOTAL | 2 | 5 | 0.07 | redbull-2014, renault-2014 | the 2014 multi-color swirl and wordmark |
| INEOS | 2 | 6 | 0.07 | mercedes-2022, mercedes-2026 | wordmark in the red-ringed roundel |
| ALPINE | 2 | 3 | 0.07 | alpine-2022, alpine-2026 | the A arrow |
| MOBIL | 2 | 4 | 0.06 | williams-1980s, redbull-2026 |  |
| CLARO | 2 | 6 | 0.06 | forceindia-2014, redbull-2022 |  |
| AMG | 2 | 2 | 0.05 | mercedes-2014, mercedes-2026 | italic wordmark |
| TEZOS | 2 | 2 | 0.05 | mclaren-2022, redbull-2022 |  |
| FORD | 2 | 2 | 0.05 | redbull-2026, racingbulls-2026 |  |
| SNAPDRAGON | 2 | 2 | 0.045 | ferrari-2022, mercedes-2026 |  |
| TEAMVIEWER | 2 | 2 | 0.045 | mercedes-2022, mercedes-2026 |  |
| HRC | 2 | 2 | 0.045 | redbull-2022, alphatauri-2022 |  |
| PERONI | 2 | 2 | 0.045 | astonmartin-2022, ferrari-2026 |  |
| DURACELL | 2 | 2 | 0.045 | williams-2022, williams-2026 |  |
| CROWDSTRIKE | 2 | 2 | 0.04 | mercedes-2022, mercedes-2026 |  |
| DUPONT | 2 | 2 | 0.038 | jaguar-2004, alpine-2022 |  |
| PETROBRAS | 2 | 2 | 0.035 | williams-2004, williams-2014 |  |
| HAAS TOOLING | 2 | 2 | 0.035 | haas-2022, haas-2026 |  |
| ASTON MARTIN | 2 | 2 | 0.025 | astonmartin-2022, astonmartin-2026 | the wings |
| TWG | 1 | 1 | 0.14 | cadillac-2026 |  |
| VISA | 1 | 4 | 0.13 | racingbulls-2026 | italic blue wordmark |
| GR | 1 | 2 | 0.13 | haas-2026 | Gazoo Racing GR mark |
| CANON | 1 | 4 | 0.12 | williams-1980s | red wordmark |
| CAMEL | 1 | 7 | 0.12 | lotuscamel-1980s | the camel silhouette and wordmark |
| ALPHATAURI | 1 | 4 | 0.12 | alphatauri-2022 |  |
| VELO | 1 | 4 | 0.11 | mclaren-2022 |  |
| WEST | 1 | 6 | 0.1 | mclaren-2004 | wordmark with the zigzag W |
| EMC | 1 | 2 | 0.1 | renault-2014 |  |
| ORLEN | 1 | 8 | 0.1 | alfaromeo-2022 | eagle and wordmark |
| W | 1 | 4 | 0.1 | williams-2022 | the Williams W chevrons |
| JPS | 1 | 5 | 0.09 | lotus-1980s | gold JPS monogram |
| PARMALAT | 1 | 5 | 0.09 | brabham-1980s | italic wordmark with the flower |
| MARTINI | 1 | 6 | 0.09 | williams-2014 | the red bar, black ball and MARTINI on it, plus the racing stripes |
| JCB | 1 | 1 | 0.09 | astonmartin-2022 |  |
| TAURI | 1 | 2 | 0.09 | alphatauri-2022 |  |
| 1&1 | 1 | 2 | 0.09 | haas-2022 |  |
| ENI | 1 | 2 | 0.09 | alpine-2026 |  |
| TGR | 1 | 1 | 0.09 | haas-2026 | Gazoo Racing GR mark |
| IFS | 1 | 2 | 0.09 | cadillac-2026 |  |
| SAHARA | 1 | 3 | 0.085 | forceindia-2014 |  |
| AGIP | 1 | 3 | 0.08 | ferrari-1980s | the six-legged dog |
| BENETTON | 1 | 3 | 0.08 | benetton-1980s | the green wordmark |
| LOTUS | 1 | 1 | 0.08 | lotuscamel-1980s |  |
| HSBC | 1 | 3 | 0.08 | jaguar-2004 | the red hexagon |
| ASOS | 1 | 2 | 0.08 | mclaren-2014 |  |
| INFINITI | 1 | 3 | 0.08 | redbull-2014 | the oval road mark and wordmark |
| OKX | 1 | 3 | 0.08 | mclaren-2022 |  |
| BYBIT | 1 | 5 | 0.08 | redbull-2022 |  |
| AUDI | 1 | 2 | 0.08 | audi-2026 | the four rings |
| PANASONIC | 1 | 4 | 0.075 | toyota-2004 |  |
| ALFA ROMEO | 1 | 1 | 0.075 | alfaromeo-2022 | the cross-and-serpent badge |
| ATLASSIAN | 1 | 2 | 0.075 | williams-2026 |  |
| KOMATSU | 1 | 3 | 0.075 | williams-2026 |  |
| REVOLUT | 1 | 3 | 0.075 | audi-2026 |  |
| SISLEY | 1 | 1 | 0.07 | benetton-1980s |  |
| HP INVENT | 1 | 1 | 0.07 | williams-2004 |  |
| ANDROID | 1 | 1 | 0.07 | mclaren-2022 |  |
| ZIBA | 1 | 2 | 0.07 | alphatauri-2022 |  |
| GEMINI | 1 | 1 | 0.07 | mclaren-2026 |  |
| ARM | 1 | 1 | 0.07 | astonmartin-2026 |  |
| LUCKY STRIKE | 1 | 7 | 0.065 | bar-2004 | the red-and-white target roundel |
| SMIRNOFF | 1 | 2 | 0.065 | forceindia-2014 |  |
| DORILTON | 1 | 1 | 0.065 | williams-2022 |  |
| SANTAL | 1 | 3 | 0.06 | brabham-1980s |  |
| FEDEX | 1 | 4 | 0.06 | williams-2004 | two-tone wordmark with the arrow |
| TELEFONICA | 1 | 1 | 0.06 | renault-2004 |  |
| AT&T | 1 | 1 | 0.06 | jaguar-2004 |  |
| TOYOTA | 1 | 3 | 0.06 | toyota-2004 | the three ellipses |
| RAY-BAN | 1 | 1 | 0.06 | ferrari-2022 |  |
| AWS | 1 | 5 | 0.06 | ferrari-2022 |  |
| WILLIAMS RACING | 1 | 1 | 0.06 | williams-2022 |  |
| DELL | 1 | 1 | 0.06 | mclaren-2026 |  |
| DROPBOX | 1 | 2 | 0.06 | mclaren-2026 |  |
| MAADEN | 1 | 1 | 0.06 | astonmartin-2026 |  |
| R | 1 | 1 | 0.06 | audi-2026 |  |
| TACTEL | 1 | 2 | 0.055 | williams-1980s |  |
| UPS | 1 | 1 | 0.055 | ferrari-2014 | the brown shield |
| WILLIAMS | 1 | 1 | 0.055 | williams-2022 | the Williams W chevrons |
| UNICREDIT | 1 | 5 | 0.055 | ferrari-2026 |  |
| MSC | 1 | 2 | 0.055 | alpine-2026 |  |
| JOHN PLAYER SPECIAL | 1 | 2 | 0.05 | lotus-1980s | serif wordmark |
| ICI | 1 | 1 | 0.05 | williams-1980s |  |
| RIELLO | 1 | 2 | 0.05 | benetton-1980s |  |
| FLYING TIGERS | 1 | 3 | 0.05 | benetton-1980s |  |
| PIRELLI | 1 | 1 | 0.05 | benetton-1980s | the long P |
| VODAFONE | 1 | 6 | 0.05 | ferrari-2004 | the speech-mark roundel |
| SIEMENS | 1 | 2 | 0.05 | mclaren-2004 |  |
| BUD | 1 | 1 | 0.05 | williams-2004 |  |
| MILD SEVEN | 1 | 5 | 0.05 | renault-2004 | wordmark |
| MODE | 1 | 1 | 0.05 | renault-2004 |  |
| UGS | 1 | 2 | 0.05 | jaguar-2004 |  |
| BURN | 1 | 3 | 0.05 | renault-2014 |  |
| VELAS | 1 | 3 | 0.05 | ferrari-2022 |  |
| MAPFRE | 1 | 1 | 0.05 | alpine-2022 |  |
| DUCATI | 1 | 1 | 0.05 | williams-2022 |  |
| WORKDAY | 1 | 4 | 0.05 | mclaren-2026 |  |
| CASH APP | 1 | 5 | 0.05 | racingbulls-2026 |  |
| HUGO | 1 | 1 | 0.05 | racingbulls-2026 |  |
| BW SCORES | 1 | 4 | 0.05 | williams-2026 |  |
| MPHASIS | 1 | 3 | 0.05 | haas-2026 |  |
| CADILLAC | 1 | 5 | 0.05 | cadillac-2026 | the 2026 crest |
| ENICHEM | 1 | 1 | 0.045 | ferrari-1980s |  |
| LONGINES | 1 | 1 | 0.045 | ferrari-1980s |  |
| DIGITAL | 1 | 1 | 0.045 | ferrari-1980s |  |
| SHOWA | 1 | 1 | 0.045 | mclaren-1980s |  |
| INTERCOND | 1 | 1 | 0.045 | bar-2004 |  |
| BECKS | 1 | 2 | 0.045 | jaguar-2004 |  |
| PIONEER | 1 | 1 | 0.045 | jaguar-2004 |  |
| DENSO | 1 | 1 | 0.045 | toyota-2004 |  |
| SWISSQUOTE | 1 | 2 | 0.045 | mercedes-2014 |  |
| JOHNNIE WALKER | 1 | 2 | 0.045 | mclaren-2014 |  |
| GSK | 1 | 1 | 0.045 | mclaren-2014 |  |
| KINGFISHER | 1 | 2 | 0.045 | forceindia-2014 |  |
| ARTURA | 1 | 1 | 0.045 | mclaren-2022 |  |
| HILTON | 1 | 1 | 0.045 | mclaren-2022 |  |
| MANDIANT | 1 | 1 | 0.045 | alpine-2022 |  |
| BUZZ | 1 | 1 | 0.045 | alphatauri-2022 |  |
| MASTERCARD | 1 | 1 | 0.045 | mclaren-2026 |  |
| GROQ | 1 | 1 | 0.045 | mclaren-2026 |  |
| ROKT | 1 | 1 | 0.045 | redbull-2026 |  |
| COHERE | 1 | 1 | 0.045 | astonmartin-2026 |  |
| BARCLAYS | 1 | 1 | 0.045 | williams-2026 |  |
| STEPHENS | 1 | 1 | 0.045 | williams-2026 |  |
| GULF | 1 | 1 | 0.045 | williams-2026 |  |
| FIX | 1 | 1 | 0.045 | haas-2026 |  |
| BP | 1 | 1 | 0.045 | audi-2026 |  |
| VISIT QATAR | 1 | 4 | 0.045 | audi-2026 |  |
| CRYPTO.COM | 1 | 1 | 0.042 | astonmartin-2022 |  |
| TAG | 1 | 1 | 0.04 | mclaren-1980s |  |
| DENIM | 1 | 1 | 0.04 | williams-1980s |  |
| BRIDGESTONE | 1 | 2 | 0.04 | ferrari-2004 |  |
| MERCEDES-BENZ | 1 | 1 | 0.04 | mclaren-2004 |  |
| MERCEDES | 1 | 1 | 0.04 | mclaren-2004 |  |
| BUDWEISER | 1 | 1 | 0.04 | williams-2004 |  |
| REUTERS | 1 | 2 | 0.04 | williams-2004 |  |
| BLACKBERRY | 1 | 1 | 0.04 | mercedes-2014 |  |
| SAP | 1 | 1 | 0.04 | mclaren-2014 |  |
| RAUCH | 1 | 1 | 0.04 | redbull-2014 |  |
| RANDSTAD | 1 | 2 | 0.04 | williams-2014 |  |
| ORIS | 1 | 1 | 0.04 | williams-2014 |  |
| CADENCE | 1 | 1 | 0.04 | mclaren-2022 |  |
| WEBEX | 1 | 1 | 0.04 | mclaren-2022 |  |
| ARROW | 1 | 1 | 0.04 | mclaren-2022 |  |
| DEWALT | 1 | 1 | 0.04 | mclaren-2022 |  |
| ICM | 1 | 1 | 0.04 | alphatauri-2022 |  |
| FASHION MEETS FUNCTION | 1 | 1 | 0.04 | alphatauri-2022 |  |
| IONOS | 1 | 1 | 0.04 | haas-2022 |  |
| TRANSFERMATE | 1 | 2 | 0.04 | haas-2022 |  |
| ACRONIS | 1 | 1 | 0.04 | williams-2022 |  |
| PUMA | 1 | 1 | 0.04 | ferrari-2026 | the leaping cat |
| IBM | 1 | 1 | 0.04 | ferrari-2026 |  |
| SOLERA | 1 | 1 | 0.04 | mercedes-2026 |  |
| ALLWIN | 1 | 1 | 0.04 | mclaren-2026 |  |
| INDEED | 1 | 1 | 0.04 | redbull-2026 |  |
| HEINEKEN | 1 | 1 | 0.04 | redbull-2026 |  |
| SERVICENOW | 1 | 1 | 0.04 | astonmartin-2026 |  |
| OOOO | 1 | 2 | 0.04 | audi-2026 |  |
| JIM BEAM | 1 | 1 | 0.04 | cadillac-2026 |  |
| TAG HEUER | 1 | 1 | 0.038 | redbull-2022 | the shield |
| GLENFIDDICH | 1 | 1 | 0.038 | astonmartin-2026 |  |
| CALMA | 1 | 1 | 0.035 | williams-1980s |  |
| FILA | 1 | 1 | 0.035 | brabham-1980s |  |
| ACER | 1 | 1 | 0.035 | ferrari-2004 |  |
| ALLIANZ | 1 | 1 | 0.035 | williams-2004 |  |
| HANJIN | 1 | 1 | 0.035 | renault-2004 |  |
| HUBLOT | 1 | 1 | 0.035 | ferrari-2014 |  |
| WEICHAI | 1 | 1 | 0.035 | ferrari-2014 |  |
| INFOR | 1 | 1 | 0.035 | ferrari-2014 |  |
| CASIO | 1 | 1 | 0.035 | redbull-2014 |  |
| FORCE INDIA | 1 | 1 | 0.035 | forceindia-2014 |  |
| EXPERIAN | 1 | 1 | 0.035 | williams-2014 |  |
| BINANCE | 1 | 1 | 0.035 | alpine-2022 |  |
| FASHION | 1 | 1 | 0.035 | alphatauri-2022 |  |
| EPICOR | 1 | 1 | 0.035 | alphatauri-2022 |  |
| CAMOZZI | 1 | 1 | 0.035 | alfaromeo-2022 |  |
| ADLER | 1 | 1 | 0.035 | alfaromeo-2022 |  |
| FUZION | 1 | 1 | 0.035 | williams-2022 |  |
| SIGNIFY | 1 | 1 | 0.035 | mercedes-2026 |  |
| CISCO | 1 | 1 | 0.035 | mclaren-2026 |  |
| DP WORLD | 1 | 1 | 0.035 | mclaren-2026 |  |
| CARLYLE | 1 | 1 | 0.035 | redbull-2026 |  |
| CLEAR | 1 | 1 | 0.035 | redbull-2026 |  |
| DELPHI | 1 | 1 | 0.035 | alpine-2026 |  |
| COREWEAVE | 1 | 1 | 0.035 | astonmartin-2026 |  |
| VALVOLINE | 1 | 1 | 0.035 | astonmartin-2026 |  |
| KRAKEN | 1 | 1 | 0.035 | williams-2026 |  |
| BRILLIO | 1 | 1 | 0.035 | williams-2026 |  |
| KEEPER | 1 | 1 | 0.035 | williams-2026 |  |
| ESTRELLA GALICIA | 1 | 1 | 0.035 | williams-2026 |  |
| RUCKUS | 1 | 1 | 0.035 | haas-2026 |  |
| HUGO BOSS | 1 | 1 | 0.032 | mclaren-2014 |  |
| PEPE JEANS | 1 | 1 | 0.032 | redbull-2014 |  |
| LAVAZZA | 1 | 1 | 0.032 | williams-2022 |  |
| ORION180 | 1 | 1 | 0.032 | haas-2026 |  |
| NINJA ONE | 1 | 1 | 0.032 | audi-2026 |  |
| BMW M POWER | 1 | 1 | 0.03 | benetton-1980s |  |
| MICROMAX | 1 | 1 | 0.03 | lotuscamel-1980s |  |
| TIME | 1 | 1 | 0.03 | toyota-2004 |  |
| SCUDERIA FERRARI | 1 | 1 | 0.03 | ferrari-2014 |  |
| JUNIPER | 1 | 1 | 0.03 | astonmartin-2022 |  |
| RAPIDAPI | 1 | 1 | 0.03 | alphatauri-2022 |  |
| SINGHA | 1 | 1 | 0.03 | alfaromeo-2022 |  |
| PATH | 1 | 1 | 0.03 | alfaromeo-2022 |  |
| BANG & OLUFSEN | 1 | 1 | 0.03 | williams-2022 |  |
| ZEISS | 1 | 1 | 0.03 | williams-2022 |  |
| CLUB AVOLTA | 1 | 1 | 0.03 | mclaren-2026 |  |
| 1PASSWORD | 1 | 1 | 0.03 | redbull-2026 |  |
| MERCADO LIBRE | 1 | 1 | 0.03 | alpine-2026 |  |
| AVATURE | 1 | 1 | 0.03 | alpine-2026 |  |
| PEPPERSTONE | 1 | 1 | 0.03 | astonmartin-2026 |  |
| NEXGEN | 1 | 1 | 0.03 | astonmartin-2026 |  |
| GILLETTE | 1 | 1 | 0.03 | audi-2026 |  |
| CORE SCIENTIFIC | 1 | 2 | 0.03 | cadillac-2026 |  |
| OLYMPUS | 1 | 1 | 0.028 | ferrari-2004 |  |
| KASPERSKY | 1 | 1 | 0.028 | ferrari-2014 |  |
| PETRONAS PRIMAX | 1 | 1 | 0.028 | mercedes-2014 |  |
| WHYTE & MACKAY | 1 | 1 | 0.028 | forceindia-2014 |  |
| MAHLE | 1 | 1 | 0.028 | ferrari-2022 |  |
| RENAULT E-TECH | 1 | 1 | 0.028 | alpine-2022 |  |
| BOMBARDIER | 1 | 1 | 0.028 | astonmartin-2022 |  |
| JACK DANIELS | 1 | 1 | 0.028 | mclaren-2026 |  |
| UCHICAGO | 1 | 1 | 0.028 | haas-2026 |  |
| MAGNETI MARELLI | 1 | 1 | 0.025 | ferrari-1980s |  |

252 names (some are the same sponsor written two ways, for example HAAS and HAAS TOOLING, MOBIL and MOBIL 1), 15 numbers.
