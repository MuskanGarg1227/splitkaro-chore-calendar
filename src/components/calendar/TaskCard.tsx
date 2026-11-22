import {
  Bath,
  Check,
  ClipboardList,
  Clock,
  CookingPot,
  Droplets,
  Shirt,
  ShoppingBasket,
  Sprout,
  Trash2,
  Wind,
  Brush,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER_ID, getFlatmate, type Task, type TaskKind } from "@/lib/calendar-data";
import { MateAvatar } from "./MateAvatar";
import { StatusChip } from "./StatusChip";

const KIND_ICON: Record<TaskKind, typeof Shirt> = {
  laundry: Shirt,
  groceries: ShoppingBasket,
  garbage: Trash2,
  kitchen: CookingPot,
  water: Droplets,
  plants: Sprout,
  bathroom: Bath,
  ironing: Wind,
  mop: Brush,
  other: ClipboardList,
};

const ACCENT: Record<Task["status"], string> = {
  pending: "bg-status-pending",
  done: "bg-status-done",
  swapped: "bg-status-swapped",
  overdue: "bg-status-overdue",
};

export function TaskCard({ task, onToggleDone }: { task: Task; onToggleDone: (id: string) => void }) {
  const mate = getFlatmate(task.assigneeId);
  const from = task.swappedFromId ? getFlatmate(task.swappedFromId) : null;
  const Icon = KIND_ICON[task.kind];
  const done = task.status === "done";
  const isMe = mate.id === CURRENT_USER_ID;

  return (
    <article className="relative flex gap-3 overflow-hidden rounded-2xl border bg-card p-3.5 pl-4 shadow-card">
      <span className={cn("absolute inset-y-3 left-0 w-1 rounded-r-full", ACCENT[task.status])} />

      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-5" strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "truncate text-[15px] font-bold leading-snug",
              done && "text-muted-foreground line-through decoration-2",
            )}
          >
            {task.title}
          </h3>
          <StatusChip status={task.status} />
        </div>

        {task.note && <p className="mt-0.5 truncate text-xs text-muted-foreground">{task.note}</p>}

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 font-semibold">
              <MateAvatar mate={mate} size="xs" />
              <span className="truncate">{isMe ? "You" : mate.name}</span>
            </span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 text-muted-foreground",
                task.status === "overdue" && "font-semibold text-status-overdue",
              )}
            >
              <Clock className="size-3.5" />
              {task.time}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleDone(task.id)}
            aria-label={done ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              done
                ? "border-status-done bg-status-done text-primary-foreground"
                : "border-input text-transparent hover:border-status-done hover:text-status-done",
            )}
          >
            <Check className="size-4" strokeWidth={3} />
          </button>
        </div>

        {from && (
          <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-status-swapped-soft px-2 py-1 text-[11px] font-medium text-status-swapped">
            Swapped from {from.id === CURRENT_USER_ID ? "you" : from.name} · {mate.name} is covering
          </p>
        )}
      </div>
    </article>
  );
}
