import type { ComponentType, ReactNode } from "react";

/** Stable identifier for each supported device shell. */
export type DeviceKind =
  | "desktop"
  | "mobile"
  | "tablet"
  | "nfc-card"
  | "agent-puck"
  | "button-handheld";

/** Logical pixel size of a device's content/screen area. Drives scaling. */
export interface ScreenDimensions {
  width: number;
  height: number;
}

/** Props handed to every app version's screen so it can adapt to the device. */
export interface ScreenProps {
  device: DeviceDefinition;
}

/** Props handed to every device frame. The mounted app arrives as children. */
export interface FrameProps {
  device: DeviceDefinition;
  children: ReactNode;
}

/** One device shell definition. Add a device by creating one of these. */
export interface DeviceDefinition {
  /** Stable key, used in selection state. */
  id: DeviceKind;
  /** Human label shown in the selector. */
  label: string;
  kind: DeviceKind;
  /** Inner screen/content size — the app is laid out at this size, then scaled. */
  screen: ScreenDimensions;
  /** CSS-only device shell that wraps the app. */
  Frame: ComponentType<FrameProps>;
  /** Small CSS/SVG preview shown in the device selector. */
  Thumbnail: ComponentType;
}

/** One app design iteration. Add a version by creating one of these. */
export interface AppVersion {
  /** Stable key, used in selection state. */
  id: string;
  /** Human label shown in the version switcher. */
  label: string;
  /** The app content rendered inside a device screen. */
  Screen: ComponentType<ScreenProps>;
}
