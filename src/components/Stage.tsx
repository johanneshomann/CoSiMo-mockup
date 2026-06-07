import { useFitScale } from "../lib/useFitScale";
import type { AppVersion, DeviceDefinition } from "../types";

interface StageProps {
  device: DeviceDefinition;
  version: AppVersion;
}

/** Composes frame(device) × app(version) and scales it to fit the stage. */
export default function Stage({ device, version }: StageProps) {
  const { containerRef, contentRef, scale } = useFitScale(56, [
    device.id,
  ]);

  const { Frame } = device;
  const { Screen } = version;

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        ref={contentRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        <Frame device={device}>
          <Screen device={device} />
        </Frame>
      </div>
    </div>
  );
}
