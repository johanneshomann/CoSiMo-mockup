import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";
import CosimoFaceAnimated from "../components/CosimoFaceAnimated";
import { FACE_EMOTIONS, EMOTION_LABELS } from "../face/states";
import { entities } from "../face/entities";

describe("CoSiMo face section", () => {
  it("renders every entity × emotion without crashing", () => {
    for (const entity of entities) {
      for (const emotion of FACE_EMOTIONS) {
        const { container, unmount } = render(
          <entity.Component emotion={emotion} transitionMs={0} />,
        );
        expect(container.querySelector("svg")).toBeTruthy();
        unmount();
      }
    }
  });

  it("morphs the mouth geometry between emotions", () => {
    const { container, rerender } = render(
      <CosimoFaceAnimated emotion="neutral" transitionMs={0} />,
    );
    const mouth = () =>
      container.querySelector('[data-part="mouth"]')!.getAttribute("d");
    const neutral = mouth();
    rerender(<CosimoFaceAnimated emotion="surprised" transitionMs={0} />);
    expect(mouth()).not.toBe(neutral);
    cleanup();
  });

  it("morphs the abstract entities between emotions", () => {
    for (const [id, part] of [
      ["circle", "ring"],
      ["line", "wave"],
    ] as const) {
      const entity = entities.find((e) => e.id === id)!;
      const { container, rerender, unmount } = render(
        <entity.Component emotion="neutral" transitionMs={0} />,
      );
      const d = () =>
        container.querySelector(`[data-part="${part}"]`)!.getAttribute("d");
      const neutral = d();
      rerender(<entity.Component emotion="surprised" transitionMs={0} />);
      expect(d()).not.toBe(neutral);
      unmount();
    }
  });

  it("switches to the Face section, picks forms and expressions", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Face" }));
    // switch through every entity
    for (const entity of entities) {
      const btn = screen.getByRole("button", { name: entity.label });
      fireEvent.click(btn);
      expect(btn.getAttribute("aria-pressed")).toBe("true");
    }
    // pick every expression on the last entity
    for (const emotion of FACE_EMOTIONS) {
      const btn = screen.getByRole("button", {
        name: EMOTION_LABELS[emotion],
      });
      fireEvent.click(btn);
      expect(btn.getAttribute("aria-pressed")).toBe("true");
    }
    // back to mockups — the device preview is still intact
    fireEvent.click(screen.getByRole("button", { name: "Mockups" }));
    expect(screen.getAllByText("Eingabefeld").length).toBeGreaterThan(0);
    cleanup();
  });
});
