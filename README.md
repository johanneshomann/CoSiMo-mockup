# CoSiMo — Device Mockup Site

Preview the CoSiMo app inside realistic, CSS-only device shells across design
iterations. Pick a **device** (Desktop, Mobile, Tablet, NFC card, Agent puck)
and a **version**; the stage renders the chosen frame with the chosen app
version mounted inside its screen, scaled to fit.

> The app content is currently a placeholder — every device × version renders
> the wordmark **cosimo**. Real screens come later.

## Run

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm test         # smoke tests (Vitest)
```

## Deploy (Docker + Cloudflare Tunnel)

The app is built and served by nginx inside a small container on **port 4010**,
published to **loopback only** (`127.0.0.1:4010`) — no public ports. The host's
existing shared `cloudflared` tunnel (host network) reaches it at
`http://localhost:4010`.

```bash
docker compose up -d --build
```

Then in the Cloudflare Zero Trust dashboard, add a public hostname to the
existing tunnel pointing to `http://localhost:4010`.

Why nginx? `npm run build` only emits static files; nginx is the tiny in-container
web server that serves them on 4010 for cloudflared to reach.

## How it works

The stage composes `frame(device) × app(version)`. Devices and versions are
typed registry arrays, so adding either is a drop-in:

```
src/
├── devices/
│   ├── registry.ts          # the device list
│   ├── definitions/*.tsx    # one DeviceDefinition per device
│   ├── *Frame.tsx           # the CSS shells
├── versions/
│   ├── registry.ts          # the version list
│   └── vN/{index.ts,Screen.tsx}
├── components/              # DeviceSelector, VersionSwitcher, Stage, DeviceThumbnail
└── lib/useFitScale.ts       # scales a frame to fit the stage
```

### Add an app version

1. Create `src/versions/v2/Screen.tsx` (a component taking `ScreenProps`).
2. Create `src/versions/v2/index.ts` exporting an `AppVersion` (`id`, `label`, `Screen`).
3. Add one line to `src/versions/registry.ts`:
   ```ts
   import v2 from "./v2";
   export const versions = [v1, v2];
   ```

### Add a device

1. Create a frame, e.g. `src/devices/WatchFrame.tsx` (takes `FrameProps`,
   renders `children` inside a CSS shell).
2. Create `src/devices/definitions/watch.tsx` exporting a `DeviceDefinition`
   (`id`, `label`, `kind`, `screen` dimensions, `Frame`, `Thumbnail`).
3. Add the `kind` to `DeviceKind` in `src/types.ts` and a glyph case in
   `src/components/DeviceThumbnail.tsx`.
4. Add one line to `src/devices/registry.ts`.
```
