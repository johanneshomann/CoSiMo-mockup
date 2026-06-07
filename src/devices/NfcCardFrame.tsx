import type { FrameProps } from "../types";
import { useAppearance } from "../appearance/AppearanceContext";

/**
 * NFC / smart card. A passive physical card — no screen, no app UI. It carries
 * the CoSiMo brand, an EMV chip and a contactless glyph. The app `children` are
 * intentionally ignored: there is nothing to run on a card.
 */
export default function NfcCardFrame({ device }: FrameProps) {
  const { width, height } = device.screen;
  const { character } = useAppearance();
  const Mark = character.Mark;

  return (
    <div
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-neutral-100 shadow-2xl ring-1 ring-white/10"
      style={{ width, height }}
    >
      {/* sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent" />

      {/* EMV chip */}
      <div className="absolute left-[7%] top-[16%] h-[18%] w-[13%] rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow">
        <div className="absolute inset-[18%] rounded-sm border border-amber-700/40" />
      </div>

      {/* contactless glyph */}
      <svg
        className="absolute right-[7%] top-[14%] h-[22%] text-neutral-300/80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M6 8a8 8 0 0 1 0 8" />
        <path d="M10 5a13 13 0 0 1 0 14" />
        <path d="M14 3a18 18 0 0 1 0 18" />
      </svg>

      {/* brand: the CoSiMo face mark + wordmark */}
      <div className="absolute bottom-[12%] left-[7%] flex items-center gap-3">
        <Mark className="h-10 w-auto" strokeWidth={11} />
        <span className="font-brand text-2xl font-semibold tracking-tight">
          cosimo
        </span>
      </div>
    </div>
  );
}
