import type { FrameProps } from "../types";

const BEZEL = 12;

/** Desktop monitor: slim bezel, chin with brand notch, neck + stand foot. */
export default function DesktopFrame({ device, children }: FrameProps) {
  const { width, height } = device.screen;

  return (
    <div className="flex flex-col items-center">
      {/* monitor body */}
      <div
        className="rounded-[16px] bg-neutral-900 p-3 pb-7 shadow-2xl ring-1 ring-black/40"
        style={{ width: width + BEZEL * 2 }}
      >
        <div
          className="overflow-hidden rounded-[6px] bg-black"
          style={{ width, height }}
        >
          {children}
        </div>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-neutral-700" />
      </div>

      {/* neck + stand */}
      <div className="h-7 w-10 rounded-b-md bg-neutral-800" />
      <div className="h-[10px] w-44 rounded-full bg-neutral-800 shadow-lg" />
    </div>
  );
}
