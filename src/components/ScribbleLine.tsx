import type { FaceEmotion } from "../face/states";
import {
  IN_TEST,
  smoothPath,
  useAmbientClock,
  useTweenedParams,
  type Pt,
  type ScribbleEntityProps,
} from "../face/shared";
import ScribbleCanvas from "./ScribbleCanvas";

/**
 * Linie — one horizontal pen line with a personality; emotion is its
 * waveform, and its idle motion is wave physics: the waveform travels.
 * Rolling speech waves, fine incoming listening ripples, a slow neutral
 * drift, a spinning thought-knot, a breath-swell rising and falling in
 * sleep, a trembling startle spike.
 */

interface LineParams {
  /** Wave amplitude. */
  amp: number;
  /** Wave count across the canvas. */
  freq: number;
  /** Wave phase — ambient motion advances this to make the wave travel. */
  phase: number;
  /** Right tail falls and the wave dies down (sad). */
  droop: number;
  /** One sharp startle spike in the middle. */
  spike: number;
  /** One broad slow breath-swell (sleeping). */
  swell: number;
  /** Dense thought-knot in the middle (thinking). */
  tangle: number;
  posY: number;
  tilt: number;
}

const LINE_STATES: Record<FaceEmotion, LineParams> = {
  neutral: { amp: 7, freq: 2.2, phase: 1.3, droop: 0.06, spike: 0, swell: 0, tangle: 0, posY: 0, tilt: 0 },
  happy: { amp: 15, freq: 2.7, phase: 1.3, droop: 0, spike: 0, swell: 0, tangle: 0, posY: -4, tilt: -2 },
  thinking: { amp: 2.5, freq: 1.6, phase: 1.3, droop: 0, spike: 0, swell: 0, tangle: 1, posY: -2, tilt: 2 },
  listening: { amp: 4.5, freq: 5.5, phase: 1.3, droop: 0, spike: 0, swell: 0, tangle: 0, posY: 0, tilt: 0 },
  speaking: { amp: 11, freq: 3.4, phase: 1.3, droop: 0, spike: 0, swell: 0, tangle: 0, posY: 0, tilt: 0 },
  sleeping: { amp: 1.4, freq: 2, phase: 1.3, droop: 0, spike: 0, swell: 1, tangle: 0, posY: 12, tilt: 0 },
  sad: { amp: 3.5, freq: 1.8, phase: 1.3, droop: 1, spike: 0, swell: 0, tangle: 0, posY: 4, tilt: 0 },
  surprised: { amp: 2.5, freq: 2.2, phase: 1.3, droop: 0, spike: 1, swell: 0, tangle: 0, posY: 4, tilt: 0 },
};

const BASE_Y = 102;
const X0 = 14;
const X1 = 246;

function linePath(p: LineParams): string {
  const n = 72;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = X0 + (X1 - X0) * t;
    // Fade the wave towards both ends so the stroke starts/ends calmly.
    const env = Math.pow(Math.sin(Math.PI * t), 0.65);
    const amp = p.amp * (1 - 0.45 * p.droop * t);
    const y =
      BASE_Y +
      p.posY +
      amp * env * Math.sin(2 * Math.PI * p.freq * t + p.phase) +
      p.droop * 58 * Math.pow(t, 2.6) -
      p.spike * 72 * Math.exp(-Math.pow((t - 0.5) / 0.04, 2)) -
      p.swell * 13 * Math.sin(Math.PI * t);
    pts.push([x, y]);
  }
  return smoothPath(pts);
}

/* The thought-knot: a small spiral the pen scribbles onto the line while
   thinking. Static shape, faded in via the tangle param and slowly spun by
   the ambient clock. */
const TANGLE_D = (() => {
  const pts: Pt[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = -Math.PI / 2 + t * 3 * 2 * Math.PI;
    const r = 17 * (1 - 0.55 * t);
    pts.push([130 + Math.cos(a) * r * 1.15, 92 + Math.sin(a) * r]);
  }
  return smoothPath(pts);
})();

/**
 * Idle motion in wave physics: advancing the phase makes the waveform
 * travel — outward when speaking, inward (against reading direction) when
 * listening, a slow drift at rest. Amplitude modulation carries the energy.
 * All time-based terms are zero or constant-rate at t=0.
 */
function withAmbient(p: LineParams, emotion: FaceEmotion, t: number): LineParams {
  const q = { ...p };
  switch (emotion) {
    case "neutral":
      q.phase += t * 0.5; // lazy drift
      q.amp *= 1 + 0.1 * Math.sin(t * 0.7);
      break;
    case "happy":
      q.phase += t * 2.2; // rolling, energetic waves
      q.posY -= 4 * Math.abs(Math.sin(t * 3));
      q.amp *= 1 + 0.15 * Math.sin(t * 3);
      break;
    case "thinking":
      q.phase += t * 0.3; // the line is quiet; the knot does the thinking
      break;
    case "listening":
      q.phase -= t * 3.2; // ripples flow inward, towards the listener
      q.amp *= 1 + 0.12 * Math.sin(t * 6);
      break;
    case "speaking":
      q.phase += t * 4.5; // speech rolls outward
      q.amp *= 1 + 0.22 * Math.sin(t * 7.3);
      break;
    case "sleeping":
      q.swell *= 0.75 + 0.3 * Math.sin(t * 0.75); // breath rises and falls
      break;
    case "sad":
      q.phase += t * 0.15; // almost still
      q.droop += 0.04 * Math.sin(t * 0.4);
      break;
    case "surprised":
      q.spike *= 1 + 0.06 * Math.sin(t * 24); // the spike trembles
      q.posY += 0.8 * Math.sin(t * 31);
      break;
  }
  return q;
}

export default function ScribbleLine({
  emotion,
  className,
  strokeWidth = 4.5,
  style,
  transitionMs,
  idle = true,
}: ScribbleEntityProps) {
  const duration = transitionMs ?? (IN_TEST ? 0 : 350);
  const tweened = useTweenedParams(LINE_STATES[emotion], duration);
  const t = useAmbientClock(idle && !IN_TEST);
  const p = withAmbient(tweened, emotion, t);
  const knotSpin = emotion === "thinking" ? t * 40 : 0;

  return (
    <ScribbleCanvas className={className} style={style} strokeWidth={strokeWidth}>
      {() => (
        <g transform={`rotate(${p.tilt} 130 ${BASE_Y})`}>
          <path data-part="wave" d={linePath(p)} />
          {p.tangle > 0.02 && (
            <path
              opacity={p.tangle}
              transform={`translate(0 ${p.posY}) rotate(${knotSpin} 130 92)`}
              d={TANGLE_D}
            />
          )}
        </g>
      )}
    </ScribbleCanvas>
  );
}
