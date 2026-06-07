import CosimoFace from "../components/CosimoFace";

/**
 * The "characters" that represent CoSiMo — our inclusive mobility & accessible
 * agent. They don't have to be faces; each is a simple `currentColor` mark so it
 * inherits the active scheme's ink. Selectable in the app menu under "Aussehen".
 */
export interface MarkProps {
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export interface Character {
  id: string;
  label: string;
  Mark: React.ComponentType<MarkProps>;
}

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Voice — sound-equaliser bars (the agent listens & speaks). */
function WaveMark({ className, strokeWidth = 16, style }: MarkProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} style={style} strokeWidth={strokeWidth} {...stroke}>
      <path d="M40 82 L40 118" />
      <path d="M80 58 L80 142" />
      <path d="M120 38 L120 162" />
      <path d="M160 64 L160 136" />
      <path d="M200 88 L200 112" />
    </svg>
  );
}

/** Mobility — a winding route ending in a location pin. */
function RouteMark({ className, strokeWidth = 12, style }: MarkProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} style={style} strokeWidth={strokeWidth} {...stroke}>
      <path d="M36 168 C 96 168 84 96 132 96 C 168 96 168 64 168 56" />
      <circle cx="168" cy="44" r="18" />
      <circle cx="168" cy="44" r="3.5" fill="currentColor" />
    </svg>
  );
}

/** Inclusion — a heart. */
function HeartMark({ className, strokeWidth = 12, style }: MarkProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} style={style} strokeWidth={strokeWidth} {...stroke}>
      <path d="M120 168 C 54 126 44 86 70 66 C 92 49 116 64 120 92 C 124 64 148 49 170 66 C 196 86 186 126 120 168 Z" />
    </svg>
  );
}

/** Guidance — a four-point spark. */
function SparkMark({ className, strokeWidth = 12, style }: MarkProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} style={style} strokeWidth={strokeWidth} {...stroke}>
      <path d="M120 36 C 128 86 134 92 184 100 C 134 108 128 114 120 164 C 112 114 106 108 56 100 C 106 92 112 86 120 36 Z" />
    </svg>
  );
}

export const characters: Character[] = [
  { id: "face", label: "Gesicht", Mark: CosimoFace },
  { id: "wave", label: "Welle", Mark: WaveMark },
  { id: "route", label: "Route", Mark: RouteMark },
  { id: "heart", label: "Herz", Mark: HeartMark },
  { id: "spark", label: "Funke", Mark: SparkMark },
];

export const defaultCharacterId = characters[0].id;
