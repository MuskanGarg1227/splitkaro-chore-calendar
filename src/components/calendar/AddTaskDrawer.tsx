import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FLATMATES, QUICK_TASKS, formatTime, type TaskKind } from "@/lib/calendar-data";
import { MateAvatar } from "./MateAvatar";

export type NewTask = { title: string; kind: TaskKind; assigneeId: string; time: string; note?: string };

export function AddTaskDrawer({
  open,
  onOpenChange,
  dayLabel,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayLabel: string;
  onAdd: (task: NewTask) => void;
}) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<TaskKind>("other");
  const [assigneeId, setAssigneeId] = useState("muskan");
  const [time, setTime] = useState("19:00");
  const [note, setNote] = useState("");

  const canSave = title.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const base = { title: title.trim(), kind, assigneeId, time: formatTime(time) };
    onAdd(note.trim() ? { ...base, note: note.trim() } : base);
    setTitle("");
    setNote("");
    setKind("other");
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-[430px] rounded-t-3xl border-0">
        <form onSubmit={submit} className="px-5 pb-6">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-xl font-bold">New task</DrawerTitle>
            <DrawerDescription>For Flat 4 · {dayLabel}</DrawerDescription>
          </DrawerHeader>

          <label htmlFor="task-title" className="text-xs font-semibold text-muted-foreground">
            What needs doing?
          </label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setKind("other");
            }}
            placeholder="e.g. Pay the doodhwala"
            className="mt-1.5 h-12 w-full rounded-xl border bg-surface px-3.5 text-[15px] font-medium outline-none focus:border-primary focus:bg-background"
          />
          <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5">
            {QUICK_TASKS.map((q) => (
              <button
                key={q.title}
                type="button"
                onClick={() => {
                  setTitle(q.title);
                  setKind(q.kind);
                }}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  title === q.title ? "border-primary bg-primary-soft text-primary" : "text-muted-foreground",
                )}
              >
                {q.title}
              </button>
            ))}
          </div>

          <label htmlFor="task-note" className="mt-4 block text-xs font-semibold text-muted-foreground">
            Details (optional)
          </label>
          <input
            id="task-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 2 cans from Sharma ji"
            className="mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm font-medium outline-none focus:border-primary focus:bg-background"
          />

          <p className="mt-4 text-xs font-semibold text-muted-foreground">Assign to</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {FLATMATES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setAssigneeId(m.id)}
                aria-pressed={assigneeId === m.id}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border-2 py-2.5 text-xs font-semibold transition-colors",
                  assigneeId === m.id ? "border-primary bg-primary-soft" : "border-transparent bg-surface",
                )}
              >
                <MateAvatar mate={m} size="md" />
                {m.name}
              </button>
            ))}
          </div>

          <label htmlFor="task-time" className="mt-4 block text-xs font-semibold text-muted-foreground">
            Due by
          </label>
          <input
            id="task-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-xl border bg-surface px-3.5 text-[15px] font-medium outline-none focus:border-primary focus:bg-background"
          />

          <button
            type="submit"
            disabled={!canSave}
            className="mt-5 h-12 w-full rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-fab transition-opacity disabled:opacity-40 disabled:shadow-none"
          >
            Add to calendar
          </button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
