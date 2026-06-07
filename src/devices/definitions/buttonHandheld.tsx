import type { DeviceDefinition } from "../../types";
import ButtonHandheldFrame from "../ButtonHandheldFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

const buttonHandheld: DeviceDefinition = {
  id: "button-handheld",
  label: "Handheld",
  kind: "button-handheld",
  // No screen — these are the physical body dimensions.
  screen: { width: 212, height: 372 },
  Frame: ButtonHandheldFrame,
  Thumbnail: () => <DeviceThumbnail kind="button-handheld" />,
};

export default buttonHandheld;
