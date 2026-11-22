import { Bell, Check, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/calendar-data";
import { AssigneeLine } from "./AssigneeLine";
import { STATUS_META, StatusChip } from "./StatusChip";
import { TaskIcon } from "./TaskIcon";

export function TaskCard({
  task,
  onOpen,
  onToggleDone,
}: {
  task: Task;
  onOpen: (id: string) => void;
  onToggleDone: (id: string) => void;
}) {
  const done = task.status === "done";

  return (
    <article className="relative overflow-hidden rounded-2xl border bg-card shadow-card transition-colors hover:border-primary/30">
      {/* Whole card opens details; content sits above it without catching taps. */}
      <button
        type="button"
        onClick={() => onOpen(task.id)}
        aria-label={`Open details for ${task.title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted/60"
      />
      <span className={cn("absolute inset-y-3 left-0 w-1 rounded-r-full", STATUS_META[task.status].solid)} />

      <div className="pointer-events-none relative flex gap-3 p-3.5 pl-4">
        <TaskIcon kind={task.kind} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "truncate pt-0.5 text-[15px] font-bold leading-tight",
                done && "text-muted-foreground line-through decoration-2",
              )}
            >
              {task.title}
            </h3>
            <StatusChip status={task.status} />
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {task.note ?? "No description added"}
          </p>

          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <AssigneeLine task={task} />
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1 text-xs text-muted-foreground",
                  task.status === "overdue" && "font-semibold text-status-overdue",
                )}
              >
                <Clock className="size-3.5" />
                {task.time}
              </span>
              {(task.seriesId || task.reminder) && (
                <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                  {task.seriesId && <Repeat className="size-3.5" aria-label="Repeats" />}
                  {task.reminder && <Bell className="size-3.5" aria-label={`Reminder at ${task.reminder}`} />}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onToggleDone(task.id)}
              aria-label={done ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
              className={cn(
                "pointer-events-auto flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done
                  ? "border-status-done bg-status-done text-primary-foreground"
                  : "border-input bg-card text-transparent hover:border-status-done hover:text-status-done",
              )}
            >
              <Check className="size-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
