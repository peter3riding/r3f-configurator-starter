# 3D Shirt Configurator

A rebuild of the well-known [pmndrs T-shirt configurator demo](https://www.udemy.com/course/react-three-fiber-configurator/) with a commercial-grade architecture underneath: data-driven configuration, shareable URL state, derived pricing with a snapshot cart, loading/error/no-WebGL fallbacks, and a compressed asset pipeline (Draco + KTX2).

**[Live demo →](https://r3f-configurator-starter.vercel.app/)**
**Try the share link:** change the color and decal, copy the URL, open it in a new tab — the exact configuration restores.

---

## Why this exists

The original demo is a great tutorial artifact — and like most tutorial code, it hardcodes its options in two places, stores raw values in state, has no URL state, no loading or error handling, and ships uncompressed assets. This rebuild keeps the same visuals and replaces the skeleton with the architecture a commercial configurator actually needs. The interesting part isn't what it looks like; it's the decisions underneath.

## Features

- **Data-driven configuration** — one typed config file defines every option, label, and price. Adding an option is adding data: the swatch, the price, and the texture preload all appear with zero new code.
- **Shareable URL state** — the current configuration lives in the URL and restores exactly on load, with garbage params ignored safely.
- **Live derived pricing + snapshot cart** — the running total is computed, never stored; a cart line freezes its price at add-time.
- **Production loading states** — real progress loader, error boundary with a static fallback, WebGL feature detection.
- **Compressed assets** — Draco geometry + KTX2 (ETC1S) textures. The dominant texture went **3.28 MB → 878 KB (~73%)**, and KTX2 stays compressed in GPU memory.
- **PNG export** of the configured shirt.

## Architecture decisions

### Ids in state, truth in config

State stores `{ colorId: "gold" }`, never the hex, label, or price — those live in one typed config (`as const satisfies Record<string, OptionValue>`), so an invalid id won't compile and option data can't drift between copies. The store is a bookmark; the config is the book.

### Price is derived, never stored — except in the cart, deliberately

`useTotalPrice()` computes the total from the selection on every read. There is no `price` field in state, so the price can never disagree with the selection — staleness is structurally impossible. The one deliberate exception is the cart: a cart line **snapshots** the computed price at add-time, because a cart line is a historical record ("what it cost when they added it"), not a live value. If the config's prices changed tomorrow, the live total would move and the cart lines would not — both behaviors are correct. _Live values derive; records snapshot._

### Who consumes the value decides the read

This started from a Valtio-based course project; the rebuild uses Zustand instead. Valtio's proxies make every read reactive by default — Zustand makes you ask for it, which is what makes the choice below visible rather than automatic.

The same component uses both Zustand read patterns, each for a reason:

```tsx
function Shirt() {
  const decal = useSelectedDecal(); // JSX renders it → subscribe
  const texture = useTexture(`/${decal.id}.png`);

  useFrame((_, delta) => {
    const { selectedColorId } = getShirtState(); // only the frame loop consumes it → transient read
    easing.dampC(
      materials.lambert1.color,
      shirtConfig.colors[selectedColorId].hex,
      0.25,
      delta,
    );
  });
}
```

The decal must re-render the component (the texture swaps in JSX), so it subscribes. The color is only read by the 60fps damp loop, so subscribing would cause re-renders that change nothing — it's read transiently via `getState()` instead. React re-renders exist to change what's rendered; if nothing rendered changes, don't re-render.

### One-way URL flow

The URL is read **once**, at module scope before first render: `hydrateFromURL()` validates each param against the config (`color in shirtConfig.colors`) and ignores anything invalid, so outside data can't break the store's type guarantees. After that, the flow reverses permanently: every select action writes the URL outward via `history.replaceState`. There is no effect that both reads and writes the URL — that two-way bridge is the classic feedback-loop bug this design exists to avoid. Hydration also calls `set` directly rather than going through `selectColor`, because `selectColor` carries a URL-write side effect, and reading the URL must not trigger writing it.

### Asset pipeline with measured results

`gltf-transform inspect` → `etc1s` (textures first) → `draco` (geometry last, so nothing decodes it afterward). ETC1S over UASTC because the shirt's only texture is a baked color map (UASTC is for normal/hero maps this asset doesn't have). The decal PNGs were deliberately left uncompressed: tiny textures are the case where KTX2's overhead outweighs the gain.

Result on this asset: texture **3.28 MB → 878 KB**; geometry savings were marginal because a t-shirt is a low-poly mesh — on this model, textures were where the bytes lived.

Loading KTX2 in R3F requires a module-level singleton `KTX2Loader` passed through `useGLTF`'s `extendLoader`, with `detectSupport(gl)` run inside the component (the WebGL context doesn't exist at module scope). Consequence: the KTX2 GLB is **not** preloaded — a bare `useGLTF.preload` on a KTX2 file crashes, because it starts loading textures before any loader can be attached.

### Store API surface

Components never touch the raw store. The module exports atomic state hooks (`useSelectedColor`, `useTotalPrice`, `useCart`), one grouped actions hook (`useShirtActions`, safe under `useShallow` because action references never change), and a single `getShirtState` alias for frame loops — so subscribing from outside is impossible by construction, not by discipline. Every `set` is named; the Redux DevTools timeline reads as a changelog of user events (`selectColor → selectDecal → addToCart`).

## Stack

React 19 · React Three Fiber v9 · drei · Zustand v5 · TypeScript · Vite · Tailwind v4 · Motion · gltf-transform CLI · KTX-Software

## Running locally

```bash
npm install
npm run dev
```

The KTX2 transcoder is served from `public/basis/` (copied from `three/examples/jsm/libs/basis/`), so no CDN dependency.

## Deliberate scope

This is the architecture chassis, not a storefront: the layout is minimal, there's no checkout, and options are two independent groups. The pieces that need a richer product — cross-option constraint logic, camera choreography, real pricing data — are the next projects, built on this foundation.
