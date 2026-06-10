import { useState } from "react";
import CosimoFaceAnimated from "../components/CosimoFaceAnimated";
import {
  FACE_EMOTIONS,
  EMOTION_LABELS,
  type FaceEmotion,
} from "../face/states";

/**
 * Dedicated section for the CoSiMo face: the hand-drawn mark on its white
 * face plate, morphing between expressions via the picker below.
 */
export default function FaceLab() {
  const [emotion, setEmotion] = useState<FaceEmotion>("neutral");
  const [idle, setIdle] = useState(true);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-6">
      {/* face plate — echoes the device's white circular plate */}
      <div className="flex aspect-square w-[min(58vmin,420px)] items-center justify-center rounded-full bg-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-neutral-200">
        <CosimoFaceAnimated
          emotion={emotion}
          idle={idle}
          className="w-[72%] text-neutral-900"
        />
      </div>

      {/* expression picker */}
      <div className="flex max-w-md flex-wrap items-center justify-center gap-2">
        {FACE_EMOTIONS.map((id) => {
          const active = id === emotion;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setEmotion(id)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
              }`}
            >
              {EMOTION_LABELS[id]}
            </button>
          );
        })}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
        <input
          type="checkbox"
          checked={idle}
          onChange={(e) => setIdle(e.target.checked)}
          className="accent-neutral-900"
        />
        Idle motion (blink &amp; speech pulse)
      </label>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
        Face · {EMOTION_LABELS[emotion]}
      </div>
    </div>
  );
}
