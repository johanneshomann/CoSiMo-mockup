import type { DeviceDefinition } from "../../types";
import NfcCardFrame from "../NfcCardFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

// Credit-card aspect ratio (ISO/IEC 7810 ID-1 ≈ 1.586:1).
const nfcCard: DeviceDefinition = {
  id: "nfc-card",
  label: "NFC card",
  kind: "nfc-card",
  screen: { width: 760, height: 479 },
  Frame: NfcCardFrame,
  Thumbnail: () => <DeviceThumbnail kind="nfc-card" />,
};

export default nfcCard;
