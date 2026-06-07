import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";
import { devices } from "../devices/registry";
import { versions } from "../versions/registry";

describe("CoSiMo mockup smoke", () => {
  it("renders without crashing and shows the agent input", () => {
    render(<App />);
    expect(screen.getAllByText("Eingabefeld").length).toBeGreaterThan(0);
    cleanup();
  });

  it("renders every device × version without crashing", () => {
    for (const device of devices) {
      for (const version of versions) {
        const { container, unmount } = render(
          <device.Frame device={device}>
            <version.Screen device={device} />
          </device.Frame>,
        );
        // Screen-less devices (card, handheld) ignore the app UI by design,
        // so just assert the frame mounted something.
        expect(container.firstChild).toBeTruthy();
        unmount();
      }
    }
  });

  it("switches the active device when a thumbnail is clicked", () => {
    render(<App />);
    for (const device of devices) {
      const btn = screen.getByRole("button", {
        name: new RegExp(`^${device.label}$`, "i"),
      });
      fireEvent.click(btn);
      expect(btn.getAttribute("aria-pressed")).toBe("true");
    }
    cleanup();
  });

  it("toggles the 'more' panel from the dock chevron", () => {
    render(<App />);
    const mehr = screen.getByRole("button", { name: "Mehr" });
    // panel content stays mounted (for the open/close animation); state is
    // reflected on the button instead.
    expect(mehr.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(mehr);
    expect(mehr.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("Lautstärke")).toBeTruthy();
    cleanup();
  });

  it("opens the Farben and Aussehen pickers from the menu", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Mehr" }));

    // Farben → scheme options
    fireEvent.click(screen.getByText("Farben"));
    expect(screen.getByText("Ozean")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));

    // Aussehen → character options
    fireEvent.click(screen.getByText("Aussehen"));
    expect(screen.getByRole("button", { name: "Welle" })).toBeTruthy();
    cleanup();
  });
});
