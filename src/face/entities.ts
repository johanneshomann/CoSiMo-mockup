import type { ComponentType } from "react";
import CosimoFaceAnimated from "../components/CosimoFaceAnimated";
import ScribbleBlob from "../components/ScribbleBlob";
import ScribbleCircle from "../components/ScribbleCircle";
import ScribbleLine from "../components/ScribbleLine";
import type { ScribbleEntityProps } from "./shared";

/**
 * The switchable scribble entities of the Face section. All four share the
 * same emotion vocabulary (FaceEmotion) and the same pen — one figure, one
 * mass, one outline, one line.
 */
export interface ScribbleEntity {
  id: "face" | "blob" | "circle" | "line";
  label: string;
  Component: ComponentType<ScribbleEntityProps>;
}

export const entities: ScribbleEntity[] = [
  { id: "face", label: "Gesicht", Component: CosimoFaceAnimated },
  { id: "blob", label: "Knäuel", Component: ScribbleBlob },
  { id: "circle", label: "Kreis", Component: ScribbleCircle },
  { id: "line", label: "Linie", Component: ScribbleLine },
];

export const defaultEntityId = entities[0].id;
