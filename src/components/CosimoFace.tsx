/**
 * The CoSiMo face mark — a single source of truth so the agent's face looks
 * identical everywhere (the app screen, the NFC card brand, …). Uses
 * `currentColor` so the surrounding text colour drives the stroke.
 */
export default function CosimoFace({
  className,
  strokeWidth = 8,
  style,
}: {
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 260 200"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* eyes */}
      <path d="M86 70 L86 98" />
      <path d="M174 70 L174 98" />
      {/* nose */}
      <path d="M130 104 L130 136 L148 131" />
      {/* smile */}
      <path d="M86 158 C108 188 152 188 174 158" />
    </svg>
  );
}
