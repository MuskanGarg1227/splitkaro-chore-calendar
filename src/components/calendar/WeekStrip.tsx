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
  const index = WEEK.findIndex((d) => d.date === selected);
  const prev = WEEK[index - 1];
  const next = WEEK[index + 1];

  return (
    <section className="rounded-2xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold">16 – 22 Nov 2026</h2>
        <div className="flex items-center gap-1">
          {selected !== TODAY && (
            <button
              type="button"
              onClick={() => onSelect(TODAY)}
              className="mr-1 h-7 rounded-full bg-primary-soft px-2.5 text-[11px] font-bold text-primary"
            >
              Today
            </button>
          )}
          <button
            type="button"
            aria-label="Previous day"
            disabled={!prev}
            onClick={() => prev && onSelect(prev.date)}
            className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-35"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next day"
            disabled={!next}
            onClick={() => next && onSelect(next.date)}
            className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-35"
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
              aria-label={`${d.weekday} ${d.day} November${isToday ? ", today" : ""}, ${dayTasks.length} tasks`}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-1.5 transition-colors",
                isSelected ? "bg-primary text-primary-foreground shadow-fab" : "hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  isSelected ? "text-primary-foreground/80" : isToday ? "text-primary" : "text-muted-foreground",
                )}
              >
                {isToday ? "Today" : d.weekday}
              </span>
              <span className="text-base font-bold leading-none">{d.day}</span>
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  dayTasks.length === 0
                    ? "bg-transparent"
                    : isSelected
                      ? "bg-primary-foreground"
                      : hasOverdue
                        ? "bg-status-overdue"
                        : allDone
                          ? "bg-status-done"
                          : "bg-status-pending",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
