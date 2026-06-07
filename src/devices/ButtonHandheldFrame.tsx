import type { FrameProps } from "../types";
import { useAppearance } from "../appearance/AppearanceContext";
import {
  CameraIcon,
  ChevronUpIcon,
  HeadphonesIcon,
  MicIcon,
} from "../components/icons";

/**
 * Screen-less handheld — a pocket controller whose four large physical buttons
 * are the whole interface. No display, so the app `children` are ignored. It is
 * custom-produced: the body takes the active scheme's ink colour, the buttons
 * the background tone, and the chosen character is 3D-printed (embossed) into
 * the plastic above the buttons.
 */
export default function ButtonHandheldFrame({ device }: FrameProps) {
  const { width, height } = device.screen;
  const { scheme, character } = useAppearance();
  const Mark = character.Mark;

  const buttons = [
    { label: "Vorlesen", Icon: HeadphonesIcon },
    { label: "Sprechen", Icon: MicIcon },
    { label: "Kamera", Icon: CameraIcon },
    { label: "Mehr", Icon: ChevronUpIcon },
  ];

  return (
    <div
      className="relative flex flex-col items-center rounded-[46px] shadow-2xl ring-1 ring-black/10"
      style={{ width, height, backgroundColor: scheme.ink }}
    >
      {/* character embossed into the body — same plastic, raised relief */}
      <Mark
        className="mt-7 h-12 w-auto"
        strokeWidth={13}
        style={{
          color: scheme.ink,
          filter:
            "drop-shadow(0 -1px 0.5px rgba(255,255,255,0.18)) drop-shadow(0 1.5px 1px rgba(0,0,0,0.55))",
        }}
      />

      {/* status LED — small, unobtrusive */}
      <span
        className="mt-4 h-2 w-2 rounded-full opacity-70"
        style={{ backgroundColor: scheme.bg }}
      />

      {/* the four buttons — the focus of the device */}
      <div className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          {buttons.map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              className="flex h-[76px] w-[76px] items-center justify-center rounded-full shadow-md ring-1 ring-black/10 transition active:translate-y-[1px]"
              style={{ backgroundColor: scheme.bg, color: scheme.ink }}
            >
              <b.Icon size={28} />
            </button>
          ))}
        </div>
      </div>

      {/* mic hole */}
      <span
        className="mb-6 h-[4px] w-[4px] rounded-full opacity-40"
        style={{ backgroundColor: scheme.bg }}
      />

      {/* side button */}
      <span
        className="absolute -right-[2px] top-1/3 h-14 w-[3px] rounded-r opacity-30"
        style={{ backgroundColor: scheme.bg }}
      />
    </div>
  );
}
