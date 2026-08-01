# ketchupandmayo — Fan Site

A fan site for **ketchupandmayo**, a Geometry Dash player and streamer — tracking his live run progress, current target **EON** (**99.90%**, one triple-spike away from the finish), and his cleared demon list.

**Live:** [ketchupandmayo.vercel.app](https://ketchupandmayo.vercel.app)

## What's on it

- **Live GD profile** — stats, stars, moons, demons, and icon set pulled straight from [GDBrowser](https://gdbrowser.com/u/ketchupandmayo).
- **Run tracker** — current attempt (EON), next target (Zodiac), and a trophy case of cleared extreme/insane demons (Bloodbath, ACU, Cataclysm, Denouement).
- **EON recordings** — side-by-side POV and stream recordings of the run, played back in a custom dark-themed video player.
- **Icon showcase** — every unlocked form (cube, ship, ball, UFO, wave, robot, spider, swing, jetpack) rendered live via the GDBrowser icon API.

## Stack

- [React 19](https://react.dev/) with Server Components
- [vinext](https://www.npmjs.com/package/vinext) — a Next.js-shaped App Router on top of Vite
- [Nitro](https://nitro.build/) for the server runtime
- Deployed on [Vercel](https://vercel.com/)
- Video recordings hosted on GitHub Releases, analytics via `@vercel/analytics`

## Running locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # vinext build, for the standard Node output
npm run build:vercel  # vite build, for Vercel's build pipeline
```
