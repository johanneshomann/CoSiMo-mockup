/* Temporary visual-preview generator — renders every emotion to an HTML grid
   so the face geometry can be eyeballed. Deleted after review. */
import { writeFileSync, mkdirSync } from "node:fs";
import { describe, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CosimoFaceAnimated from "../components/CosimoFaceAnimated";
import { FACE_EMOTIONS } from "../face/states";

describe("face preview", () => {
  it("writes preview html", () => {
    const cells = FACE_EMOTIONS.map((emotion) => {
      const svg = renderToStaticMarkup(
        <CosimoFaceAnimated emotion={emotion} transitionMs={0} />,
      );
      return `<figure style="margin:0;text-align:center">
        <div style="width:300px;height:300px;border-radius:50%;background:#fff;
          box-shadow:0 10px 30px rgba(0,0,0,.15);display:flex;align-items:center;
          justify-content:center;color:#1a1a1a">
          <div style="width:72%">${svg}</div>
        </div>
        <figcaption style="font:13px sans-serif;color:#888;margin-top:8px">${emotion}</figcaption>
      </figure>`;
    }).join("\n");
    const html = `<!doctype html><meta charset="utf-8">
      <body style="margin:0;background:#ececed;display:grid;
        grid-template-columns:repeat(4,1fr);gap:28px;padding:28px;justify-items:center">
      ${cells}</body>`;
    mkdirSync(".face-preview", { recursive: true });
    writeFileSync(".face-preview/preview.html", html);
  });
});
