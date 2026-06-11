import { useState } from "react";
import { useAppearance } from "../../appearance/AppearanceContext";
import CosimoFaceAnimated from "../../components/CosimoFaceAnimated";
import {
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  GearIcon,
  HeadphonesIcon,
  MicIcon,
} from "../../components/icons";
import type { ScreenProps } from "../../types";

/**
 * Version 1 app screen — the CoSiMo agent UI:
 *  - settings gear (top-right)
 *  - the chosen character mark in the centre
 *  - a dock of actions; the chevron expands a "more" menu (Farben / Aussehen …)
 *  - a text input ("Eingabefeld") to write to the agent
 *
 * Colours come from the active two-colour scheme; voice-first devices (the
 * agent puck) have no keyboard, so they show the mark + a compact dock only.
 */
export default function Screen({ device }: ScreenProps) {
  const { scheme, character } = useAppearance();
  const [moreOpen, setMoreOpen] = useState(false);

  const Mark = character.Mark;
  // On screens the face character is alive (idle blinking); physical
  // surfaces (NFC card print, embossed handheld) keep the static mark.
  const CharacterMark = ({ className }: { className?: string }) =>
    character.id === "face" ? (
      <CosimoFaceAnimated emotion="neutral" className={className} />
    ) : (
      <Mark className={className} />
    );
  const themeStyle = {
    "--app-bg": scheme.bg,
    "--app-ink": scheme.ink,
  } as React.CSSProperties;

  // Compact, voice-first layout for the agent puck.
  if (device.kind === "agent-puck") {
    return (
      <div
        className="app-surface relative flex h-full w-full flex-col"
        style={themeStyle}
      >
        <div className="flex flex-1 items-center justify-center p-4">
          <CharacterMark className="ink h-auto w-[58%] max-w-[170px]" />
        </div>
        <div className="px-5 pb-6">
          <div className="relative flex items-center justify-center gap-4">
            <MorePanel open={moreOpen} />
            <RoundButton label="Sprechen">
              <MicIcon />
            </RoundButton>
            <RoundButton
              label="Mehr"
              active={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              <ChevronUpIcon
                className={moreOpen ? "rotate-180 transition" : "transition"}
              />
            </RoundButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-surface relative flex h-full w-full flex-col"
      style={themeStyle}
    >
      {/* settings */}
      <button
        type="button"
        aria-label="Einstellungen"
        className="ink-faint hover-ink absolute right-4 top-4 transition"
      >
        <GearIcon />
      </button>

      {/* character */}
      <div className="flex flex-1 items-center justify-center p-6">
        <CharacterMark className="ink h-auto w-[64%] max-w-[300px]" />
      </div>

      {/* bottom dock */}
      <div className="mx-auto w-full max-w-[520px] px-4 pb-5">
        <div className="relative">
          <MorePanel open={moreOpen} />

          {/* action dock */}
          <div className="grid grid-cols-4 gap-2">
            <DockButton label="Vorlesen">
              <HeadphonesIcon />
            </DockButton>
            <DockButton label="Sprechen">
              <MicIcon />
            </DockButton>
            <DockButton label="Kamera">
              <CameraIcon />
            </DockButton>
            <DockButton
              label="Mehr"
              active={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              <ChevronUpIcon
                className={moreOpen ? "rotate-180 transition" : "transition"}
              />
            </DockButton>
          </div>
        </div>

        {/* input field */}
        <div className="field mt-2 flex items-center gap-2 rounded-full py-2 pl-4 pr-2 shadow">
          <span className="ink-faint flex-1 select-none text-sm">Eingabefeld</span>
          <button
            type="button"
            aria-label="Senden"
            className="btn-solid flex h-8 w-8 items-center justify-center rounded-full shadow transition"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- menu ---- */

type MenuView = "root" | "farben" | "aussehen";

/** The expandable "more" menu — animates up from the dock; hosts the pickers. */
function MorePanel({ open }: { open: boolean }) {
  const { schemes, scheme, setSchemeId, characters, character, setCharacterId } =
    useAppearance();
  const [view, setView] = useState<MenuView>("root");

  return (
    <div
      className={`app-panel absolute bottom-full left-0 right-0 mb-3 origin-bottom rounded-2xl p-3 shadow transition duration-200 ease-out ${
        open
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-2 scale-95 opacity-0"
      }`}
    >
      {view === "root" && (
        <ul className="flex flex-col">
          <MenuRow label="Farben" onClick={() => setView("farben")} />
          <MenuRow label="Aussehen" onClick={() => setView("aussehen")} />
          <MenuRow label="Lautstärke" />
          <MenuRow label="Hilfe" />
        </ul>
      )}

      {view === "farben" && (
        <div>
          <PanelHeader title="Farben" onBack={() => setView("root")} />
          <div className="grid grid-cols-2 gap-1">
            {schemes.map((s) => {
              const selected = s.id === scheme.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSchemeId(s.id)}
                  className="row-hover ink flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                    <span className="h-full w-1/2" style={{ backgroundColor: s.bg }} />
                    <span className="h-full w-1/2" style={{ backgroundColor: s.ink }} />
                  </span>
                  <span className="flex-1">{s.label}</span>
                  {selected && <CheckIcon size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "aussehen" && (
        <div>
          <PanelHeader title="Aussehen" onBack={() => setView("root")} />
          <div className="grid grid-cols-3 gap-2">
            {characters.map((c) => {
              const M = c.Mark;
              const selected = c.id === character.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-label={c.label}
                  onClick={() => setCharacterId(c.id)}
                  className="row-hover flex flex-col items-center gap-1 rounded-xl border p-2"
                  style={{
                    borderColor: selected
                      ? "var(--app-ink)"
                      : "color-mix(in srgb, var(--app-ink) 18%, transparent)",
                  }}
                >
                  <M className="ink h-9 w-auto" />
                  <span className="ink text-[11px]">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuRow({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="row-hover ink flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm"
      >
        <span>{label}</span>
        <span className="ink-faint">›</span>
      </button>
    </li>
  );
}

function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-2 flex items-center gap-1">
      <button
        type="button"
        aria-label="Zurück"
        onClick={onBack}
        className="row-hover ink rounded-md p-1"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <span className="ink text-sm font-medium">{title}</span>
    </div>
  );
}

/* ---- buttons ---- */

/** One action button in the dock. */
function DockButton({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="btn-ghost flex items-center justify-center rounded-full py-2.5 shadow transition"
    >
      {children}
    </button>
  );
}

/** Circular icon button, used on compact (voice) devices. */
function RoundButton({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full shadow transition"
    >
      {children}
    </button>
  );
}
