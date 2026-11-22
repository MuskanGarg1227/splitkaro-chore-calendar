import { ArrowRight } from "lucide-react";
import { CURRENT_USER_ID, getFlatmate, type Task } from "@/lib/calendar-data";
import { MateAvatar } from "./MateAvatar";

function nameOf(id: string) {
  return id === CURRENT_USER_ID ? "You" : getFlatmate(id).name;
}

/** Assignee, or "original → new" for swapped tasks. */
export function AssigneeLine({ task }: { task: Task }) {
  const mate = getFlatmate(task.assigneeId);
  if (task.swappedFromId) {
    const from = getFlatmate(task.swappedFromId);
    return (
      <span
        className="flex min-w-0 items-center gap-1 text-xs"
        aria-label={`Swapped from ${nameOf(from.id)} to ${nameOf(mate.id)}`}
      >
        <MateAvatar mate={from} size="xs" className="opacity-60" />
        <span className="truncate text-muted-foreground line-through decoration-1">{nameOf(from.id)}</span>
        <ArrowRight className="size-3.5 shrink-0 text-status-swapped" strokeWidth={2.5} />
        <MateAvatar mate={mate} size="xs" />
        <span className="truncate font-semibold">{nameOf(mate.id)}</span>
      </span>
    );
  }
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-xs">
      <MateAvatar mate={mate} size="xs" />
      <span className="truncate font-semibold">{nameOf(mate.id)}</span>
    </span>
  );
}
