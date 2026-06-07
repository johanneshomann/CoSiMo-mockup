import type { DeviceDefinition } from "../../types";
import DesktopFrame from "../DesktopFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

const desktop: DeviceDefinition = {
  id: "desktop",
  label: "Desktop",
  kind: "desktop",
  screen: { width: 1280, height: 800 },
  Frame: DesktopFrame,
  Thumbnail: () => <DeviceThumbnail kind="desktop" />,
};

export default desktop;
