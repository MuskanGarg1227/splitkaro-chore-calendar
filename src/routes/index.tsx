import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, ChevronDown, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AddTaskDrawer, type NewTask } from "@/components/calendar/AddTaskDrawer";
import { BottomNav } from "@/components/calendar/BottomNav";
import { MateAvatar } from "@/components/calendar/MateAvatar";
import { TaskCard } from "@/components/calendar/TaskCard";
import { TaskDetailsDrawer } from "@/components/calendar/TaskDetailsDrawer";
import { TaskSummary } from "@/components/calendar/TaskSummary";
import { WeekStrip } from "@/components/calendar/WeekStrip";
import {
  FLATMATES,
  SAMPLE_TASKS,
  TODAY,
  WEEK,
  getFlatmate,
  setTaskDone,
  summarizeTasks,
  swapTask,
  type Task,
} from "@/lib/calendar-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flat 4 Calendar · Splitkaro" },
      {
        name: "description",
        content: "See who's on laundry, groceries, garbage and kitchen duty this week in Flat 4.",
      },
      { property: "og:title", content: "Flat 4 Calendar · Splitkaro" },
      {
        property: "og:description",
        content: "A shared weekly chore calendar for flatmates, inside Splitkaro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarHome,
});

const FULL_DAY: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

function timeValue(t: string) {
  const [hm = "0:00", ap] = t.split(" ");
  const [h = 0, m = 0] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
}

function CalendarHome() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [selected, setSelected] = useState(TODAY);
  const [addOpen, setAddOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const day = WEEK.find((d) => d.date === selected) ?? WEEK[WEEK.length - 1]!;
  const dayName = FULL_DAY[day.weekday] ?? day.weekday;
  const isToday = selected === TODAY;
  const shortDay = `${dayName}, ${day.day} Nov`;

  const dayTasks = useMemo(
    () => tasks.filter((t) => t.date === selected).sort((a, b) => timeValue(a.time) - timeValue(b.time)),
    [tasks, selected],
  );
  const summary = useMemo(() => summarizeTasks(dayTasks), [dayTasks]);
  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;
  const openTaskDay = WEEK.find((d) => d.date === openTask?.date);

  function updateTask(id: string, fn: (t: Task) => Task) {
    setTasks((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));
  }

  function setDone(id: string, done: boolean) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask(id, (x) => setTaskDone(x, done));
    if (done) toast.success(`${t.title} marked done`, { description: `Nice one, ${getFlatmate(t.assigneeId).name}!` });
  }

  function swap(id: string, assigneeId: string) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask(id, (x) => swapTask(x, assigneeId));
    toast(`${t.title} is now with ${getFlatmate(assigneeId).name}`);
  }

  function addTask(n: NewTask) {
    setTasks((prev) => [...prev, { id: `new-${Date.now()}`, date: selected, status: "pending", ...n }]);
    toast.success("Task added", { description: `${n.title} · ${getFlatmate(n.assigneeId).name} · ${n.time}` });
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-surface pb-[148px]">
      {/* Compact group header */}
      <header className="hero-band rounded-b-3xl px-4 pb-10 pt-3 text-primary-foreground">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-75">Splitkaro Calendar</p>
            <button type="button" className="flex items-center gap-1 text-2xl font-extrabold leading-tight">
              Flat 4 <ChevronDown className="size-5 opacity-70" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5" aria-label="4 flatmates: Muskan, Nandini, Mehak, Lakshay">
              {FLATMATES.map((m) => (
                <MateAvatar key={m.id} mate={m} size="sm" className="size-7 ring-2 ring-primary" />
              ))}
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-full bg-primary-foreground/15"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-status-overdue ring-2 ring-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="-mt-7 space-y-3 px-4">
        <WeekStrip selected={selected} onSelect={setSelected} tasks={tasks} />

        <TaskSummary
          title={isToday ? "Today's tasks" : `${dayName}'s tasks`}
          dateLabel={`${dayName}, ${day.day} November`}
          summary={summary}
        />

        <ul className="space-y-2.5" aria-label="Tasks">
          {dayTasks.map((t) => (
            <li key={t.id}>
              <TaskCard task={t} onOpen={setOpenTaskId} onToggleDone={(id) => setDone(id, t.status !== "done")} />
            </li>
          ))}
        </ul>
        {dayTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card p-6 text-center">
            <Sparkles className="mx-auto size-5 text-primary" />
            <p className="mt-2 font-bold">Nothing planned</p>
            <p className="text-sm text-muted-foreground">Enjoy the chai break ☕</p>
          </div>
        )}
      </main>

      {/* Fixed dock: Add Task sits above the nav, so it never overlaps a card */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] shadow-nav">
        <div className="bg-background px-4 pb-2 pt-2.5">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-fab transition-transform active:scale-[0.98]"
          >
            <Plus className="size-5" strokeWidth={3} />
            Add Task
            <span className="font-medium opacity-75">· {isToday ? "Today" : shortDay}</span>
          </button>
        </div>
        <BottomNav />
      </div>

      <AddTaskDrawer open={addOpen} onOpenChange={setAddOpen} dayLabel={shortDay} onAdd={addTask} />
      <TaskDetailsDrawer
        task={openTask}
        dayLabel={openTaskDay ? `${FULL_DAY[openTaskDay.weekday] ?? openTaskDay.weekday}, ${openTaskDay.day} Nov` : ""}
        onClose={() => setOpenTaskId(null)}
        onSetDone={setDone}
        onSwap={swap}
      />
    </div>
  );
}
