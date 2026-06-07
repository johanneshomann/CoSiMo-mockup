import type { DeviceDefinition } from "../../types";
import TabletFrame from "../TabletFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

const tablet: DeviceDefinition = {
  id: "tablet",
  label: "Tablet",
  kind: "tablet",
  screen: { width: 834, height: 1112 },
  Frame: TabletFrame,
  Thumbnail: () => <DeviceThumbnail kind="tablet" />,
};

export default tablet;
