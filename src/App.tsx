import { useState } from "react";
import { devices, defaultDeviceId } from "./devices/registry";
import { versions, defaultVersionId } from "./versions/registry";
import DeviceSelector from "./components/DeviceSelector";
import VersionSwitcher from "./components/VersionSwitcher";
import Stage from "./components/Stage";
import FaceLab from "./sections/FaceLab";
import { AppearanceProvider } from "./appearance/AppearanceContext";
import type { DeviceKind } from "./types";

/** Top-level site sections. */
const sections = [
  { id: "mockups", label: "Mockups" },
  { id: "face", label: "Face" },
] as const;
type SectionId = (typeof sections)[number]["id"];

export default function App() {
  const [section, setSection] = useState<SectionId>("mockups");
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
        <div className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
            Section
          </h2>
          <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1">
            {sections.map((s) => {
              const active = s.id === section;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  aria-pressed={active}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        {section === "mockups" && (
          <>
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
          </>
        )}
      </aside>

      {/* stage */}
      <main className="relative min-h-0 flex-1 bg-[radial-gradient(circle_at_50%_25%,#fafafa,#ececed)]">
        {section === "mockups" ? (
          <>
            <Stage device={device} version={version} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
              {device.label} · {version.label} · {device.screen.width}×
              {device.screen.height}
            </div>
          </>
        ) : (
          <FaceLab />
        )}
      </main>
    </div>
    </AppearanceProvider>
  );
}
