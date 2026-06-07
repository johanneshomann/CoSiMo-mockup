import type { FrameProps } from "../types";

const BEZEL = 14; // px of body around the screen

/** Modern smartphone: thin uniform bezel, rounded corners, pill notch. */
export default function MobileFrame({ device, children }: FrameProps) {
  const { width, height } = device.screen;

  return (
    <div
      className="relative rounded-[44px] bg-neutral-900 p-[14px] shadow-2xl ring-1 ring-black/40"
      style={{ width: width + BEZEL * 2, height: height + BEZEL * 2 }}
    >
      {/* side buttons */}
      <span className="absolute -left-[2px] top-[110px] h-12 w-[3px] rounded-l bg-neutral-700" />
      <span className="absolute -right-[2px] top-[90px] h-16 w-[3px] rounded-r bg-neutral-700" />

      {/* screen */}
      <div
        className="relative overflow-hidden rounded-[30px] bg-black"
        style={{ width, height }}
      >
        {children}
        {/* dynamic-island pill */}
        <div className="pointer-events-none absolute left-1/2 top-2 h-[26px] w-[34%] -translate-x-1/2 rounded-full bg-black/95" />
      </div>
    </div>
  );
}
