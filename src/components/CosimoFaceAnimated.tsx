import { useEffect, useId, useRef, useState } from "react";
import {
  FACE_STATES,
  type FaceEmotion,
  type FaceParams,
} from "../face/states";

/**
 * The CoSiMo face, animatable between expressions. Geometry is traced from
 * the original scribble artwork: eyes are nests of overlapping loops with a
 * dense filled pupil (the top loops double as eyebrows), the nose is one
 * long J-stroke with a hooked base, the mouth a single lazy asymmetric curve.
 *
 * Morphing tweens the numeric FaceParams with requestAnimationFrame and
 * rebuilds/transforms the geometry each frame — CSS transitions on path `d`
 * are not reliable cross-browser, plain numbers are.
 *
 * On top of that, a turbulence displacement filter wobbles every stroke and
 * a faint offset second pass imitates pen overdraw.
 */

const PARAM_KEYS = Object.keys(FACE_STATES.neutral) as (keyof FaceParams)[];

/** Vitest sets VITEST in the env; snap instead of tweening under jsdom. */
const IN_TEST = Boolean(
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.VITEST,
);

function useTweenedParams(target: FaceParams, durationMs: number): FaceParams {
  const [params, setParams] = useState(target);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (durationMs <= 0 || typeof requestAnimationFrame !== "function") {
      setParams(target);
      return;
    }
    const from = { ...paramsRef.current };
    const start = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const k = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const next = {} as FaceParams;
      for (const key of PARAM_KEYS) {
        next[key] = from[key] + (target[key] - from[key]) * k;
      }
      setParams(next);
      if (t < 1) raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return params;
}

/* Layout constants, traced from the artwork (mapped onto the 260×200 canvas). */
const EYE_L = { x: 48, y: 31 };
const EYE_R = { x: 202, y: 33 };
const MOUTH_CX = 104;

interface EyeProps {
  p: FaceParams;
  side: "L" | "R";
}

/**
 * One scribble eye: overlapping offset loops plus a filled pupil blob. The
 * loops are clean ellipses — the turbulence filter turns them into scribbles.
 * Expression comes from transforms: openness squashes the nest (blink/sleep),
 * roundness inflates it (surprised), lift raises it (the eyebrow role), slant
 * tilts it (worry), and gaze shifts the pupil inside the loops.
 */
function ScribbleEye({ p, side }: EyeProps) {
  const { x, y } = side === "L" ? EYE_L : EYE_R;
  const open = side === "L" ? p.eyeOpenL : p.eyeOpenR;
  const lift = side === "L" ? p.browLiftL : p.browLiftR;
  const slant = side === "L" ? p.browSlantL : p.browSlantR;
  const rot = (side === "L" ? -slant : slant) * 0.8;

  const sx = 1 + p.eyeRound * 0.3;
  const sy = sx * Math.max(0.13, open);

  return (
    <g
      transform={
        `translate(${x} ${y - lift * 0.6}) rotate(${rot})` +
        ` scale(${sx} ${sy}) translate(${-x} ${-y})`
      }
    >
      {side === "L" ? (
        <>
          <ellipse cx={x} cy={y} rx={17} ry={19} transform={`rotate(-8 ${x} ${y})`} />
          <ellipse cx={x + 2} cy={y - 2} rx={11} ry={12.5} transform={`rotate(10 ${x} ${y})`} />
          <ellipse cx={x + 1} cy={y + 2} rx={5.5} ry={7} />
          {/* single outer lash — a short plain flick */}
          <path d={`M${x - 16} ${y - 10} L${x - 22.5} ${y - 15.5}`} />
        </>
      ) : (
        <>
          <ellipse cx={x} cy={y} rx={16} ry={17} transform={`rotate(12 ${x} ${y})`} />
          <ellipse cx={x - 8} cy={y - 6} rx={10} ry={11} transform={`rotate(-15 ${x} ${y})`} />
          {/* single outer lash — a short plain flick */}
          <path d={`M${x + 14} ${y - 9.5} L${x + 20.5} ${y - 14.5}`} />
        </>
      )}
      {/* pupil — dense filled blob, slightly low in the nest like the artwork */}
      <g transform={`translate(${p.gazeX * 5} ${p.gazeY * 4})`}>
        {side === "L" ? (
          <>
            <circle cx={x - 3} cy={y + 14} r={6} fill="currentColor" stroke="none" />
            <ellipse cx={x - 2} cy={y + 14} rx={8} ry={6.5} />
          </>
        ) : (
          <>
            <circle cx={x - 1} cy={y + 5} r={6.5} fill="currentColor" stroke="none" />
            <ellipse cx={x - 1} cy={y + 6} rx={8.5} ry={7.5} />
          </>
        )}
      </g>
    </g>
  );
}

/**
 * Mouth: one asymmetric sweep — starts high left, dips low, trails off to the
 * right (the artwork's lazy smile). A reverse curve opens it into an oval;
 * at mouthOpen 0 the return leg retraces the sweep exactly, so a closed
 * mouth stays a single stroke.
 */
function mouthPath(p: FaceParams) {
  const w = p.mouthWidth * 1.3;
  const c = p.mouthCurve;
  const lx = MOUTH_CX - w;
  const rx = MOUTH_CX + w;
  const ly = p.mouthY - 0.45 * c;
  const ry = p.mouthY + 0.35 * c;
  const c1x = MOUTH_CX - 0.9 * p.mouthWidth;
  const c2x = MOUTH_CX + 0.5 * p.mouthWidth;
  const c1y = p.mouthY + 0.85 * c;
  const c2y = p.mouthY + 0.6 * c;
  const o = p.mouthOpen * 55;
  return (
    `M${lx} ${ly} C${c1x} ${c1y}, ${c2x} ${c2y}, ${rx} ${ry}` +
    ` C${c2x} ${c2y + o}, ${c1x} ${c1y + o}, ${lx} ${ly}`
  );
}

/* Nose, derived from the artwork but softened: a short stroke falling from
   between the eyes, rounding gently at the tip into a small leftward base.
   Static across expressions. */
const NOSE_D =
  "M143 72" +
  " C146.5 86, 152.5 101, 155.5 114" +
  " C157 121, 156.5 126.5, 153.5 129" +
  " C149.5 131.5, 139 130.8, 129.5 129.5";

function FaceStrokes({
  p,
  blinking,
  talking,
  mainPass,
}: {
  p: FaceParams;
  blinking: boolean;
  talking: boolean;
  mainPass: boolean;
}) {
  return (
    <>
      <g className={blinking ? "cosimo-blink" : undefined}>
        <ScribbleEye p={p} side="L" />
        <ScribbleEye p={p} side="R" />
      </g>
      <path d={NOSE_D} />
      <path
        data-part={mainPass ? "mouth" : undefined}
        className={talking ? "cosimo-talk" : undefined}
        d={mouthPath(p)}
      />
    </>
  );
}

export interface CosimoFaceAnimatedProps {
  emotion: FaceEmotion;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  /** Morph duration in ms. Defaults to 350 (0 under test). */
  transitionMs?: number;
  /** Ambient motion: idle blinking and the speaking mouth pulse. */
  idle?: boolean;
}

export default function CosimoFaceAnimated({
  emotion,
  className,
  strokeWidth = 4.5,
  style,
  transitionMs,
  idle = true,
}: CosimoFaceAnimatedProps) {
  const duration = transitionMs ?? (IN_TEST ? 0 : 350);
  const p = useTweenedParams(FACE_STATES[emotion], duration);

  const ambient = idle && !IN_TEST;
  const blinking =
    ambient && emotion !== "sleeping" && emotion !== "surprised";
  const talking = ambient && emotion === "speaking";

  // useId may contain colons, which break url(#…) references.
  const filterId = `cosimo-scribble-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 260 200"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <g transform={`rotate(${p.tilt} 130 110)`}>
          <FaceStrokes p={p} blinking={blinking} talking={talking} mainPass />
        </g>
        {/* overdraw pass — a faint, slightly offset retrace of every stroke */}
        <g
          transform={`rotate(${p.tilt - 0.7} 130 110) translate(1.6 -1)`}
          opacity={0.25}
          strokeWidth={strokeWidth * 0.6}
        >
          <FaceStrokes
            p={p}
            blinking={blinking}
            talking={talking}
            mainPass={false}
          />
        </g>
      </g>
    </svg>
  );
}
