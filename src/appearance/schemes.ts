/**
 * Two-colour app schemes. `bg` is the app background, `ink` is the foreground
 * ("app black") used for text, icons, the character mark, and — because the
 * agent puck and handheld are custom-produced — their physical body colour.
 */
export interface ColorScheme {
  id: string;
  label: string;
  bg: string;
  ink: string;
}

export const schemes: ColorScheme[] = [
  { id: "classic", label: "Klassisch", bg: "#ffffff", ink: "#141414" },
  { id: "night", label: "Nacht", bg: "#16181c", ink: "#f3f4f6" },
  { id: "ocean", label: "Ozean", bg: "#eef6fb", ink: "#0d4a6b" },
  { id: "forest", label: "Wald", bg: "#eef6ef", ink: "#1f5132" },
  { id: "sun", label: "Sonne", bg: "#fff7e9", ink: "#7a4a00" },
  { id: "berry", label: "Beere", bg: "#fdeff5", ink: "#7c1d49" },
  { id: "slate", label: "Schiefer", bg: "#eef0f3", ink: "#28323d" },
];

export const defaultSchemeId = schemes[0].id;
