import type { AppVersion } from "../types";

interface VersionSwitcherProps {
  versions: AppVersion[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Segmented control for switching between app design iterations. */
export default function VersionSwitcher({
  versions,
  selectedId,
  onSelect,
}: VersionSwitcherProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
        Version
      </h2>
      <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1">
        {versions.map((version) => {
          const active = version.id === selectedId;
          return (
            <button
              key={version.id}
              type="button"
              onClick={() => onSelect(version.id)}
              aria-pressed={active}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {version.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
