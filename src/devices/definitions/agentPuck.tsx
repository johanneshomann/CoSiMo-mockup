import type { DeviceDefinition } from "../../types";
import AgentPuckFrame from "../AgentPuckFrame";
import DeviceThumbnail from "../../components/DeviceThumbnail";

const agentPuck: DeviceDefinition = {
  id: "agent-puck",
  label: "Agent device",
  kind: "agent-puck",
  screen: { width: 300, height: 300 },
  Frame: AgentPuckFrame,
  Thumbnail: () => <DeviceThumbnail kind="agent-puck" />,
};

export default agentPuck;
