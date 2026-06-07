import type { DeviceDefinition } from "../types";
import desktop from "./definitions/desktop";
import mobile from "./definitions/mobile";
import tablet from "./definitions/tablet";
import nfcCard from "./definitions/nfcCard";
import agentPuck from "./definitions/agentPuck";
import buttonHandheld from "./definitions/buttonHandheld";

/**
 * All device shells.
 * Add a device: create a frame + a definition, then add one line here.
 */
export const devices: DeviceDefinition[] = [
  desktop,
  mobile,
  tablet,
  nfcCard,
  agentPuck,
  buttonHandheld,
];

export const defaultDeviceId = devices[1].id; // mobile reads best on first load
