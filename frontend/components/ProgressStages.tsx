import { Check, Loader2, X } from "lucide-react";
import clsx from "clsx";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/types";

export function ProgressStages({
  stage,
  progress,
  errorMessage,
}: {
  stage: PipelineStage;
  progress: number;
  errorMessage?: string;
}) {
  if (stage === "error") {
    return (
      <div className="flex items-center gap-2 text-rust text-xs font-mono">
        <X size={13} /> {errorMessage ?? "Xử lý thất bại"}
      </div>
    );
  }

  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {PIPELINE_STAGES.map((s, i) => {
        const done = i < currentIndex || (i === currentIndex && stage === "ready");
        const active = i === currentIndex && stage !== "ready";
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className={clsx(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono border",
                done && "bg-teal/10 border-teal/40 text-teal-dark",
                active && "bg-amber-light border-amber text-amber-dark stage-active",
                !done && !active && "border-moss text-ink-soft/60"
              )}
            >
              {done ? (
                <Check size={11} />
              ) : active ? (
                <Loader2 size={11} className="animate-spin" />
              ) : null}
              {s.label}
            </span>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="h-px w-3 bg-moss" aria-hidden />
            )}
          </div>
        );
      })}
      {stage !== "ready" && (
        <span className="text-[11px] font-mono text-ink-soft ml-1">{progress}%</span>
      )}
    </div>
  );
}
