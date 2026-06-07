import { useState } from "react";
import { devices, defaultDeviceId } from "./devices/registry";
import { versions, defaultVersionId } from "./versions/registry";
import DeviceSelector from "./components/DeviceSelector";
import VersionSwitcher from "./components/VersionSwitcher";
import Stage from "./components/Stage";
import { AppearanceProvider } from "./appearance/AppearanceContext";
import type { DeviceKind } from "./types";

export default function App() {
  const [deviceId, setDeviceId] = useState<DeviceKind>(defaultDeviceId);
  const [versionId, setVersionId] = useState<string>(defaultVersionId);

  // Resolve ids to definitions; fall back to the first entry if a stale id slips in.
  const device = devices.find((d) => d.id === deviceId) ?? devices[0];
  const version = versions.find((v) => v.id === versionId) ?? versions[0];

  return (
    <AppearanceProvider>
    <div className="flex h-full flex-col bg-white text-neutral-900 lg:flex-row">
      {/* sidebar */}
      <aside className="flex flex-col gap-6 border-b border-neutral-200 p-5 lg:w-64 lg:border-b-0 lg:border-r">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">CoSiMo</h1>
          <p className="text-xs text-neutral-500">Device mockup preview</p>
        </div>
        <VersionSwitcher
          versions={versions}
          selectedId={version.id}
          onSelect={setVersionId}
        />
        <DeviceSelector
          devices={devices}
          selectedId={device.id}
          onSelect={setDeviceId}
        />
      </aside>

      {/* stage */}
      <main className="relative min-h-0 flex-1 bg-[radial-gradient(circle_at_50%_25%,#fafafa,#ececed)]">
        <Stage device={device} version={version} />
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
          {device.label} · {version.label} · {device.screen.width}×
          {device.screen.height}
        </div>
      </main>
    </div>
    </AppearanceProvider>
  );
}
