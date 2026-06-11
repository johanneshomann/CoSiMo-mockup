import { useState } from "react";
import {
  FACE_EMOTIONS,
  EMOTION_LABELS,
  type FaceEmotion,
} from "../face/states";
import {
  entities,
  defaultEntityId,
  type ScribbleEntity,
} from "../face/entities";

/**
 * Dedicated section for the CoSiMo scribble characters: four entities (face,
 * tangle, ring, line) on the white face plate, each expressing the same
 * emotion vocabulary in its own body language.
 */
export default function FaceLab() {
  const [entityId, setEntityId] =
    useState<ScribbleEntity["id"]>(defaultEntityId);
  const [emotion, setEmotion] = useState<FaceEmotion>("neutral");
  const [idle, setIdle] = useState(true);

  const entity = entities.find((e) => e.id === entityId) ?? entities[0];
  const Entity = entity.Component;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-6">
      {/* face plate — echoes the device's white circular plate */}
      <div className="flex aspect-square w-[min(58vmin,420px)] items-center justify-center rounded-full bg-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-neutral-200">
        <Entity
          emotion={emotion}
          idle={idle}
          className="w-[80%] text-neutral-900"
        />
      </div>

      {/* entity picker */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Form
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {entities.map((e) => {
            const active = e.id === entityId;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setEntityId(e.id)}
                aria-pressed={active}
                className={`rounded-xl border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-neutral-900 bg-neutral-100 text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
                }`}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* expression picker */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Emotion
        </h2>
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
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
        <input
          type="checkbox"
          checked={idle}
          onChange={(e) => setIdle(e.target.checked)}
          className="accent-neutral-900"
        />
        Idle motion (blink, bob &amp; breathing)
      </label>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
        {entity.label} · {EMOTION_LABELS[emotion]}
      </div>
    </div>
  );
}
