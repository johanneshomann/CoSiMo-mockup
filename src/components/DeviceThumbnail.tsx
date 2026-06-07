import type { DeviceKind } from "../types";

/** Small CSS glyph representing each device, used in the selector. */
export default function DeviceThumbnail({ kind }: { kind: DeviceKind }) {
  const base = "bg-neutral-600 ring-1 ring-neutral-500";

  switch (kind) {
    case "desktop":
      return (
        <div className="flex flex-col items-center">
          <div className={`h-7 w-11 rounded-sm ${base}`} />
          <div className="h-2 w-3 bg-neutral-600" />
          <div className="h-[3px] w-7 rounded-full bg-neutral-600" />
        </div>
      );
    case "mobile":
      return <div className={`h-11 w-6 rounded-[6px] ${base}`} />;
    case "tablet":
      return <div className={`h-11 w-8 rounded-[6px] ${base}`} />;
    case "nfc-card":
      return (
        <div className={`relative h-7 w-11 rounded-[4px] ${base}`}>
          <span className="absolute left-1 top-1.5 h-2 w-2.5 rounded-[2px] bg-amber-300" />
        </div>
      );
    case "agent-puck":
      return (
        <div className={`relative h-11 w-9 rounded-[14px] ${base}`}>
          <span className="absolute left-1/2 top-2 h-4 w-5 -translate-x-1/2 rounded-[4px] bg-neutral-800" />
          <span className="absolute bottom-1.5 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-neutral-700" />
        </div>
      );
    case "button-handheld":
      return (
        <div className={`relative grid h-11 w-8 grid-cols-2 content-center justify-items-center gap-1 rounded-[12px] ${base}`}>
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-900" />
        </div>
      );
  }
}
