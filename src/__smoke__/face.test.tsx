import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";
import CosimoFaceAnimated from "../components/CosimoFaceAnimated";
import { FACE_EMOTIONS, EMOTION_LABELS } from "../face/states";

describe("CoSiMo face section", () => {
  it("renders every emotion without crashing", () => {
    for (const emotion of FACE_EMOTIONS) {
      const { container, unmount } = render(
        <CosimoFaceAnimated emotion={emotion} transitionMs={0} />,
      );
      expect(container.querySelector("svg")).toBeTruthy();
      unmount();
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

  it("switches to the Face section and picks an expression", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Face" }));
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
