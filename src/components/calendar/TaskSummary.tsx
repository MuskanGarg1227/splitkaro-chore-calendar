import { cn } from "@/lib/utils";
import { completionPercent, type TaskStatus, type TaskSummary as Summary } from "@/lib/calendar-data";
import { STATUS_META } from "./StatusChip";

const ORDER: TaskStatus[] = ["done", "pending", "overdue", "swapped"];

export function TaskSummary({ title, dateLabel, summary }: { title: string; dateLabel: string; summary: Summary }) {
  const percent = completionPercent(summary);
  return (
    <section className="rounded-2xl bg-card p-3.5 shadow-card" aria-label="Task summary">
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">
            {dateLabel} · {summary.total} {summary.total === 1 ? "task" : "tasks"}
          </p>
        </div>
        <p className="shrink-0 text-sm font-bold">
          {percent}% <span className="font-medium text-muted-foreground">complete</span>
        </p>
      </div>

      <div
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Daily completion"
      >
        <div className="h-full rounded-full bg-status-done transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>

      <dl className="mt-3 grid grid-cols-4 gap-2">
        {ORDER.map((s) => {
          const meta = STATUS_META[s];
          return (
            <div key={s} className={cn("rounded-xl px-2 py-1.5 text-center", meta.chip)}>
              <dd className="text-base font-extrabold leading-tight">{summary[s]}</dd>
              <dt className="text-[11px] font-semibold">{meta.label}</dt>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
