import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Scales fixed-size content to fit its container while preserving aspect ratio.
 *
 * Both the container and the content are measured (the content's natural size
 * is read via `offsetWidth/Height`, which a CSS `transform: scale()` does not
 * affect — so measurement stays stable while the visual size shrinks). Re-runs
 * whenever the container resizes or `deps` change (e.g. a new device).
 *
 * @param padding breathing room kept around the content in px
 * @param deps    values that change the content's natural size
 */
export function useFitScale(padding = 48, deps: unknown[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const availW = container.clientWidth - padding * 2;
    const availH = container.clientHeight - padding * 2;
    const natW = content.offsetWidth;
    const natH = content.offsetHeight;
    if (availW <= 0 || availH <= 0 || natW <= 0 || natH <= 0) return;

    // Never upscale past 1 — keep frames crisp at their natural size.
    setScale(Math.min(availW / natW, availH / natH, 1));
  }, [padding]);

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return { containerRef, contentRef, scale };
}
