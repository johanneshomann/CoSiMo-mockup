import type { FrameProps } from "../types";
import { useAppearance } from "../appearance/AppearanceContext";

const PAD_X = 26;
const PAD_TOP = 26;
const GRILLE_AREA = 46; // space below the screen for speaker + mic

/**
 * Handheld "agent" device — a pocket AI/voice puck: squircle body, small inset
 * screen, speaker grille and mic hole below it. Custom-produced: the body takes
 * the active scheme's ink colour, with details in the scheme's background tone.
 */
export default function AgentPuckFrame({ device, children }: FrameProps) {
  const { width, height } = device.screen;
  const { scheme } = useAppearance();

  return (
    <div
      className="relative rounded-[40px] shadow-2xl ring-1 ring-black/10"
      style={{
        width: width + PAD_X * 2,
        height: height + PAD_TOP + GRILLE_AREA,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        paddingTop: PAD_TOP,
        backgroundColor: scheme.ink,
      }}
    >
      {/* inset screen */}
      <div
        className="overflow-hidden rounded-[22px] shadow-inner ring-1 ring-black/40"
        style={{ width, height }}
      >
        {children}
      </div>

      {/* speaker grille + mic (scheme background tone) */}
      <div className="absolute inset-x-0 bottom-[14px] flex flex-col items-center gap-[7px]">
        <div className="flex gap-[5px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-[5px] w-[5px] rounded-full opacity-50"
              style={{ backgroundColor: scheme.bg }}
            />
          ))}
        </div>
        <span
          className="h-[3px] w-[3px] rounded-full opacity-40"
          style={{ backgroundColor: scheme.bg }}
        />
      </div>

      {/* side action button */}
      <span
        className="absolute -right-[2px] top-1/2 h-12 w-[3px] -translate-y-1/2 rounded-r opacity-30"
        style={{ backgroundColor: scheme.bg }}
      />
    </div>
  );
}
