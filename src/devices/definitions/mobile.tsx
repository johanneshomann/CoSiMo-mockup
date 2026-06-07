import type { DeviceDefinition } from "../../types";
import MobileFrame from "../MobileFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

const mobile: DeviceDefinition = {
  id: "mobile",
  label: "Mobile phone",
  kind: "mobile",
  screen: { width: 390, height: 844 },
  Frame: MobileFrame,
  Thumbnail: () => <DeviceThumbnail kind="mobile" />,
};

export default mobile;
