import { Check, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CURRENT_USER_ID, FLATMATES, type Task } from "@/lib/calendar-data";
import { AssigneeLine } from "./AssigneeLine";
import { MateAvatar } from "./MateAvatar";
import { StatusChip } from "./StatusChip";
import { TaskIcon } from "./TaskIcon";

export function TaskDetailsDrawer({
  task,
  dayLabel,
  onClose,
  onSetDone,
  onSwap,
}: {
  task: Task | null;
  dayLabel: string;
  onClose: () => void;
  onSetDone: (id: string, done: boolean) => void;
  onSwap: (id: string, assigneeId: string) => void;
}) {
  const done = task?.status === "done";

  return (
    <Drawer open={task !== null} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="mx-auto max-w-[430px] rounded-t-3xl border-0">
        {task && (
          <div className="px-5 pb-6">
            <DrawerHeader className="flex items-start gap-3 px-0 text-left">
              <TaskIcon kind={task.kind} size="lg" />
              <div className="min-w-0 flex-1">
                <DrawerTitle className="text-lg font-bold leading-tight">{task.title}</DrawerTitle>
                <DrawerDescription className="mt-1 text-sm">
                  {task.note ?? "No description added"}
                </DrawerDescription>
              </div>
              <StatusChip status={task.status} />
            </DrawerHeader>

            <dl className="divide-y rounded-2xl border">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-xs font-semibold text-muted-foreground">
                  {task.swappedFromId ? "Swapped" : "Assigned to"}
                </dt>
                <dd>
                  <AssigneeLine task={task} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-xs font-semibold text-muted-foreground">Due</dt>
                <dd
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold",
                    task.status === "overdue" && "text-status-overdue",
                  )}
                >
                  <Clock className="size-3.5" />
                  {dayLabel} · {task.time}
                </dd>
              </div>
            </dl>

            {!done && (
              <>
                <p className="mt-5 text-xs font-semibold text-muted-foreground">
                  {task.swappedFromId ? "Hand it to someone else" : "Swap with a flatmate"}
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {FLATMATES.map((m) => {
                    const current = m.id === task.assigneeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        disabled={current}
                        onClick={() => onSwap(task.id, m.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-2xl border-2 py-2 text-xs font-semibold transition-colors",
                          current
                            ? "border-primary bg-primary-soft"
                            : "border-transparent bg-surface hover:border-border",
                        )}
                      >
                        <MateAvatar mate={m} size="md" className="size-9" />
                        {m.id === CURRENT_USER_ID ? "You" : m.name}
                        {current && <span className="-mt-1 text-[10px] font-medium text-primary">On duty</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => onSetDone(task.id, !done)}
              className={cn(
                "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-bold transition-colors",
                done
                  ? "border bg-background text-foreground"
                  : "bg-status-done text-primary-foreground",
              )}
            >
              {done ? <RotateCcw className="size-4" /> : <Check className="size-5" strokeWidth={3} />}
              {done ? "Mark as not done" : "Mark as done"}
            </button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
