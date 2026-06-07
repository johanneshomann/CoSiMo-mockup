import type { FrameProps } from "../types";

const BEZEL = 22;

/** Tablet: even medium bezel, gentle rounding, single front camera dot. */
export default function TabletFrame({ device, children }: FrameProps) {
  const { width, height } = device.screen;

  return (
    <div
      className="relative rounded-[34px] bg-neutral-900 p-[22px] shadow-2xl ring-1 ring-black/40"
      style={{ width: width + BEZEL * 2, height: height + BEZEL * 2 }}
    >
      {/* front camera */}
      <span className="absolute left-1/2 top-[9px] h-2 w-2 -translate-x-1/2 rounded-full bg-neutral-700" />

      <div
        className="overflow-hidden rounded-[16px] bg-black"
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}
