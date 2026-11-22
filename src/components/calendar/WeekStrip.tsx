import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TODAY, WEEK, type Task } from "@/lib/calendar-data";

export function WeekStrip({
  selected,
  onSelect,
  tasks,
}: {
  selected: string;
  onSelect: (date: string) => void;
  tasks: Task[];
}) {
  return (
    <section className="rounded-3xl bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">This week</p>
          <h2 className="text-base font-bold">16 – 22 Nov 2026</h2>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous week"
            className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next week"
            className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK.map((d) => {
          const dayTasks = tasks.filter((t) => t.date === d.date);
          const hasOverdue = dayTasks.some((t) => t.status === "overdue");
          const allDone = dayTasks.length > 0 && dayTasks.every((t) => t.status === "done");
          const isSelected = d.date === selected;
          const isToday = d.date === TODAY;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelect(d.date)}
              aria-pressed={isSelected}
              aria-label={`${d.weekday} ${d.day} November, ${dayTasks.length} tasks`}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-2 transition-all",
                isSelected ? "bg-primary text-primary-foreground shadow-fab" : "hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {d.weekday}
              </span>
              <span className="text-lg font-bold leading-none">{d.day}</span>
              <span className="flex h-1.5 items-center gap-0.5">
                {dayTasks.length > 0 && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isSelected
                        ? "bg-primary-foreground"
                        : hasOverdue
                          ? "bg-status-overdue"
                          : allDone
                            ? "bg-status-done"
                            : "bg-status-pending",
                    )}
                  />
                )}
              </span>
              {isToday && (
                <span
                  className={cn(
                    "-mt-0.5 text-[9px] font-bold uppercase tracking-wide",
                    isSelected ? "text-primary-foreground" : "text-primary",
                  )}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
