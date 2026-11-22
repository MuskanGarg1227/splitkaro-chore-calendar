import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, ChevronDown, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AddTaskDrawer, type NewTask } from "@/components/calendar/AddTaskDrawer";
import { BottomNav } from "@/components/calendar/BottomNav";
import { MateAvatar } from "@/components/calendar/MateAvatar";
import { TaskCard } from "@/components/calendar/TaskCard";
import { WeekStrip } from "@/components/calendar/WeekStrip";
import { FLATMATES, SAMPLE_TASKS, TODAY, WEEK, getFlatmate, type Task } from "@/lib/calendar-data";

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

  const day = WEEK.find((d) => d.date === selected) ?? WEEK[WEEK.length - 1]!;
  const dayName = FULL_DAY[day.weekday] ?? day.weekday;
  const isToday = selected === TODAY;

  const dayTasks = useMemo(
    () => tasks.filter((t) => t.date === selected).sort((a, b) => timeValue(a.time) - timeValue(b.time)),
    [tasks, selected],
  );
  const doneCount = dayTasks.filter((t) => t.status === "done").length;
  const overdueCount = dayTasks.filter((t) => t.status === "overdue").length;
  const progress = dayTasks.length ? Math.round((doneCount / dayTasks.length) * 100) : 0;

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "done") return { ...t, status: "pending" };
        toast.success(`${t.title} marked done`, { description: `Nice one, ${getFlatmate(t.assigneeId).name}!` });
        return { ...t, status: "done" };
      }),
    );
  }

  function addTask(n: NewTask) {
    setTasks((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, date: selected, status: "pending", ...n },
    ]);
    toast.success("Task added", { description: `${n.title} · ${getFlatmate(n.assigneeId).name} · ${n.time}` });
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-surface pb-40">
      {/* Group header */}
      <header className="hero-band rounded-b-[2rem] px-5 pb-16 pt-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold tracking-tight opacity-90">
            Splitkaro <span className="font-medium opacity-70">Calendar</span>
          </span>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full bg-primary-foreground/15"
          >
            <Bell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-status-overdue ring-2 ring-primary" />
          </button>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <button type="button" className="flex items-center gap-1.5 text-[28px] font-extrabold leading-none">
              Flat 4 <ChevronDown className="size-5 opacity-70" />
            </button>
            <p className="mt-1.5 text-sm opacity-80">4 flatmates · shared chores</p>
          </div>
          <div className="flex -space-x-2">
            {FLATMATES.map((m) => (
              <MateAvatar key={m.id} mate={m} size="md" className="size-9 ring-2 ring-primary" />
            ))}
          </div>
        </div>
      </header>

      <main className="-mt-11 space-y-5 px-4">
        <WeekStrip selected={selected} onSelect={setSelected} tasks={tasks} />

        {/* Day summary */}
        <section>
          <div className="flex items-end justify-between px-1">
            <div>
              <h2 className="text-lg font-extrabold">{isToday ? "Today's tasks" : `${dayName}'s tasks`}</h2>
              <p className="text-xs text-muted-foreground">
                {dayName}, {day.day} November
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">
                {doneCount}/{dayTasks.length} <span className="font-medium text-muted-foreground">done</span>
              </p>
              {overdueCount > 0 && (
                <p className="text-[11px] font-semibold text-status-overdue">{overdueCount} overdue</p>
              )}
            </div>
          </div>
          <div className="mx-1 mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-status-done transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 space-y-3">
            {dayTasks.map((t) => (
              <TaskCard key={t.id} task={t} onToggleDone={toggleDone} />
            ))}
            {dayTasks.length === 0 && (
              <div className="rounded-2xl border border-dashed bg-card p-6 text-center">
                <Sparkles className="mx-auto size-6 text-primary" />
                <p className="mt-2 font-bold">Nothing planned</p>
                <p className="text-sm text-muted-foreground">Enjoy the chai break ☕</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Add task */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[84px] z-20 mx-auto flex max-w-[430px] justify-end px-4">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="pointer-events-auto flex h-14 items-center gap-2 rounded-full bg-primary pl-5 pr-6 text-[15px] font-bold text-primary-foreground shadow-fab transition-transform active:scale-95"
        >
          <Plus className="size-5" strokeWidth={3} />
          Add Task
        </button>
      </div>

      <AddTaskDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        dayLabel={`${dayName}, ${day.day} Nov`}
        onAdd={addTask}
      />
      <BottomNav />
    </div>
  );
}
