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
 * Kreis — a single hand-drawn ring: the pen goes around about one and a half
 * times, the laps slightly offset, the ends never quite meeting. The most
 * minimal entity; everything is squash & stretch: it deflates into a sagging
 * egg when sad, snaps wide open when startled (the pen gap gapes), narrows
 * and tilts to think, and flattens into a slowly breathing pancake to sleep.
 */

interface CircleParams {
  /** Horizontal / vertical radius factors (squash & stretch). */
  rx: number;
  ry: number;
  /** How far the pen travels; 1.55 laps neutral, less leaves a gaping gap. */
  turns: number;
  tilt: number;
  posX: number;
  posY: number;
  /** Bottom-heavy deflation: flattens the top, bulges the bottom (sad). */
  deflate: number;
}

const CIRCLE_STATES: Record<FaceEmotion, CircleParams> = {
  neutral: { rx: 1, ry: 1, turns: 1.55, tilt: 0, posX: 0, posY: 2, deflate: 0 },
  happy: { rx: 0.98, ry: 1.08, turns: 1.6, tilt: -3, posX: 0, posY: -8, deflate: 0 },
  thinking: { rx: 0.8, ry: 1, turns: 1.5, tilt: 16, posX: -8, posY: -6, deflate: 0 },
  listening: { rx: 0.94, ry: 0.98, turns: 1.55, tilt: -10, posX: 6, posY: 0, deflate: 0 },
  speaking: { rx: 0.97, ry: 1.02, turns: 1.55, tilt: 0, posX: 0, posY: 0, deflate: 0 },
  sleeping: { rx: 1.15, ry: 0.45, turns: 1.5, tilt: 0, posX: 0, posY: 30, deflate: 0.3 },
  sad: { rx: 0.95, ry: 0.82, turns: 1.45, tilt: -8, posX: 0, posY: 16, deflate: 0.55 },
  surprised: { rx: 1.2, ry: 1.16, turns: 1.15, tilt: 6, posX: 0, posY: -4, deflate: 0 },
};

const C = { x: 130, y: 100 };
const R = 80;

function ringPath(p: CircleParams): string {
  const start = (210 * Math.PI) / 180; // pen starts lower-left, like a casual O
  const total = p.turns * Math.PI * 2;
  const steps = Math.max(12, Math.round(total / (Math.PI / 10))); // ~18° steps
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + t * total;
    // The second lap drifts slightly outward and the radius wobbles a touch,
    // so the laps read as separate pen lines.
    const drift = 1 + 0.09 * (t - 0.5);
    const wobble = 1 + 0.025 * Math.sin(a * 3 + 1);
    const px = Math.cos(a) * R * p.rx * drift * wobble;
    let py = Math.sin(a) * R * p.ry * drift * wobble;
    py *= py > 0 ? 1 + 0.6 * p.deflate : 1 - 0.35 * p.deflate;
    pts.push([C.x + p.posX + px, C.y + p.posY + py]);
  }
  return smoothPath(pts);
}

/**
 * Idle motion in the ring's own physics: it is an elastic outline, so it
 * deforms — rubbery squash & stretch, pendulum tilts, rim resonance. All
 * modulations are zero at t=0.
 */
function withAmbient(
  p: CircleParams,
  emotion: FaceEmotion,
  t: number,
): CircleParams {
  const q = { ...p };
  switch (emotion) {
    case "neutral": {
      const b = 0.012 * Math.sin(t * 1.2); // rim breathing
      q.rx *= 1 + b;
      q.ry *= 1 - b;
      break;
    }
    case "happy": {
      const bounce = Math.abs(Math.sin(t * 3.2)); // rubber-ball hops
      q.posY -= 13 * bounce;
      q.ry *= 1 + 0.08 * (bounce - 0.5); // stretch in the air…
      q.rx *= 1 - 0.08 * (bounce - 0.5); // …squash on the plate
      break;
    }
    case "thinking":
      q.tilt += 6 * Math.sin(t * 0.9); // pondering pendulum sway
      break;
    case "listening":
      q.tilt += 2 * Math.sin(t * 1.4); // attentive micro-sway
      break;
    case "speaking": {
      const w = 0.045 * Math.sin(t * 11); // rim resonating with the voice
      q.rx *= 1 + w;
      q.ry *= 1 - w;
      break;
    }
    case "sleeping":
      q.ry *= 1 + 0.08 * Math.sin(t * 0.75); // pancake breathing
      break;
    case "sad":
      q.ry *= 1 + 0.015 * Math.sin(t * 0.5); // barely-there sigh
      break;
    case "surprised":
      // tense, high-frequency tremor
      q.rx *= 1 + 0.012 * Math.sin(t * 26);
      q.ry *= 1 + 0.012 * Math.sin(t * 26 + 1.5);
      q.tilt += 0.5 * Math.sin(t * 21);
      break;
  }
  return q;
}

export default function ScribbleCircle({
  emotion,
  className,
  strokeWidth = 4.5,
  style,
  transitionMs,
  idle = true,
}: ScribbleEntityProps) {
  const duration = transitionMs ?? (IN_TEST ? 0 : 350);
  const tweened = useTweenedParams(CIRCLE_STATES[emotion], duration);
  const t = useAmbientClock(idle && !IN_TEST);
  const p = withAmbient(tweened, emotion, t);

  return (
    <ScribbleCanvas className={className} style={style} strokeWidth={strokeWidth}>
      {() => (
        <g transform={`rotate(${p.tilt} ${C.x + p.posX} ${C.y + p.posY})`}>
          <path data-part="ring" d={ringPath(p)} />
        </g>
      )}
    </ScribbleCanvas>
  );
}
