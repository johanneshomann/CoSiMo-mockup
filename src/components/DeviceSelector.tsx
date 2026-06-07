import type { DeviceDefinition, DeviceKind } from "../types";

interface DeviceSelectorProps {
  devices: DeviceDefinition[];
  selectedId: DeviceKind;
  onSelect: (id: DeviceKind) => void;
}

/** Visual, clickable device picker. */
export default function DeviceSelector({
  devices,
  selectedId,
  onSelect,
}: DeviceSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
        Device
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-1">
        {devices.map((device) => {
          const active = device.id === selectedId;
          const { Thumbnail } = device;
          return (
            <button
              key={device.id}
              type="button"
              onClick={() => onSelect(device.id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                active
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900"
                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
              }`}
            >
              <div className="flex h-12 items-center justify-center">
                <Thumbnail />
              </div>
              <span className="text-[11px] font-medium leading-tight">
                {device.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
