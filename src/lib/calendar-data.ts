export type TaskStatus = "pending" | "done" | "swapped" | "overdue";

export type Flatmate = {
  id: string;
  name: string;
  initials: string;
  /** Index into the --mate-N colour tokens */
  tone: 1 | 2 | 3 | 4;
};

export type TaskKind = "laundry" | "groceries" | "garbage" | "kitchen" | "water" | "plants" | "bathroom" | "ironing" | "mop" | "other";

export type Task = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  note?: string;
  kind: TaskKind;
  assigneeId: string;
  time: string; // display, e.g. "8:00 AM"
  status: TaskStatus;
  swappedFromId?: string;
};

export const FLATMATES: Flatmate[] = [
  { id: "muskan", name: "Muskan", initials: "MU", tone: 1 },
  { id: "nandini", name: "Nandini", initials: "NA", tone: 2 },
  { id: "mehak", name: "Mehak", initials: "ME", tone: 3 },
  { id: "lakshay", name: "Lakshay", initials: "LA", tone: 4 },
];

export const CURRENT_USER_ID = "muskan";

/** Sample "today" for the prototype — fixed so the screen renders the same everywhere. */
export const TODAY = "2026-11-22";

export const WEEK: { date: string; weekday: string; day: number }[] = [
  { date: "2026-11-16", weekday: "Mon", day: 16 },
  { date: "2026-11-17", weekday: "Tue", day: 17 },
  { date: "2026-11-18", weekday: "Wed", day: 18 },
  { date: "2026-11-19", weekday: "Thu", day: 19 },
  { date: "2026-11-20", weekday: "Fri", day: 20 },
  { date: "2026-11-21", weekday: "Sat", day: 21 },
  { date: "2026-11-22", weekday: "Sun", day: 22 },
];

export const SAMPLE_TASKS: Task[] = [
  // Mon
  { id: "t1", date: "2026-11-16", title: "Take out garbage", note: "Wet & dry bins — kachra gaadi at 7:30", kind: "garbage", assigneeId: "nandini", time: "7:15 AM", status: "done" },
  { id: "t2", date: "2026-11-16", title: "Water the balcony plants", note: "Tulsi and money plant", kind: "plants", assigneeId: "mehak", time: "6:30 PM", status: "done" },
  // Tue
  { id: "t3", date: "2026-11-17", title: "Laundry", note: "Towels + bedsheets, one load", kind: "laundry", assigneeId: "lakshay", time: "9:00 AM", status: "done" },
  { id: "t4", date: "2026-11-17", title: "Order 20L water cans", note: "2 Bisleri cans from Sharma ji", kind: "water", assigneeId: "muskan", time: "7:00 PM", status: "done" },
  // Wed
  { id: "t5", date: "2026-11-18", title: "Take out garbage", note: "Segregate plastic separately", kind: "garbage", assigneeId: "mehak", time: "7:15 AM", status: "done" },
  { id: "t6", date: "2026-11-18", title: "Buy groceries", note: "Milk, bread, eggs from the kirana", kind: "groceries", assigneeId: "muskan", time: "8:00 PM", status: "swapped", swappedFromId: "lakshay" },
  // Thu
  { id: "t7", date: "2026-11-19", title: "Clean bathroom", note: "Harpic + change the doormat", kind: "bathroom", assigneeId: "nandini", time: "10:00 AM", status: "done" },
  { id: "t8", date: "2026-11-19", title: "Give clothes to istriwala", note: "12 pieces — collect on Saturday", kind: "ironing", assigneeId: "muskan", time: "6:00 PM", status: "done" },
  // Fri
  { id: "t9", date: "2026-11-20", title: "Take out garbage", note: "Missed the van — bins still full", kind: "garbage", assigneeId: "lakshay", time: "7:15 AM", status: "overdue" },
  { id: "t10", date: "2026-11-20", title: "Clean kitchen", note: "Wipe slab and gas stove", kind: "kitchen", assigneeId: "mehak", time: "10:00 PM", status: "done" },
  // Sat
  { id: "t11", date: "2026-11-21", title: "Laundry", note: "Darks load, hang on the terrace", kind: "laundry", assigneeId: "nandini", time: "10:30 AM", status: "done" },
  { id: "t12", date: "2026-11-21", title: "Mop living room", note: "Didi is on leave this weekend", kind: "mop", assigneeId: "lakshay", time: "4:00 PM", status: "pending" },
  // Sun (today)
  { id: "t13", date: "2026-11-22", title: "Take out garbage", note: "Kachra gaadi comes by 7:30 AM", kind: "garbage", assigneeId: "lakshay", time: "7:15 AM", status: "overdue" },
  { id: "t14", date: "2026-11-22", title: "Laundry", note: "Whites + bedsheets, 2 loads", kind: "laundry", assigneeId: "mehak", time: "11:00 AM", status: "done" },
  { id: "t15", date: "2026-11-22", title: "Buy groceries", note: "Atta, toor dal, onions, milk — from DMart", kind: "groceries", assigneeId: "nandini", time: "5:30 PM", status: "swapped", swappedFromId: "muskan" },
  { id: "t16", date: "2026-11-22", title: "Clean kitchen", note: "Chimney filter + slab after dinner", kind: "kitchen", assigneeId: "muskan", time: "9:30 PM", status: "pending" },
];

export const QUICK_TASKS: { title: string; kind: TaskKind }[] = [
  { title: "Laundry", kind: "laundry" },
  { title: "Buy groceries", kind: "groceries" },
  { title: "Take out garbage", kind: "garbage" },
  { title: "Clean kitchen", kind: "kitchen" },
  { title: "Order water cans", kind: "water" },
];

export function getFlatmate(id: string): Flatmate {
  return FLATMATES.find((f) => f.id === id) ?? FLATMATES[0]!;
}

/** Turns "HH:MM" from a time input into "h:MM AM/PM". */
export function formatTime(value: string): string {
  const [hRaw, m = "00"] = value.split(":");
  const h = Number(hRaw);
  if (Number.isNaN(h)) return value;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}

/* ---------- Task logic (pure, used by the screen and tests) ---------- */

export type TaskSummary = {
  total: number;
  done: number;
  pending: number;
  overdue: number;
  swapped: number;
};

export function summarizeTasks(tasks: Task[]): TaskSummary {
  const summary: TaskSummary = { total: tasks.length, done: 0, pending: 0, overdue: 0, swapped: 0 };
  for (const t of tasks) summary[t.status] += 1;
  return summary;
}

/** Share of tasks marked Done, as a whole-number percentage. */
export function completionPercent(summary: TaskSummary): number {
  if (summary.total === 0) return 0;
  return Math.round((summary.done / summary.total) * 100);
}

/** Marks a task done, or un-done (back to Swapped if it was swapped, otherwise Pending). */
export function setTaskDone(task: Task, done: boolean): Task {
  if (done) return { ...task, status: "done" };
  return { ...task, status: task.swappedFromId ? "swapped" : "pending" };
}

/** Hands a task to another flatmate, remembering who it was originally assigned to. */
export function swapTask(task: Task, newAssigneeId: string): Task {
  const originalId = task.swappedFromId ?? task.assigneeId;
  if (newAssigneeId === originalId) {
    const { swappedFromId: _dropped, ...rest } = task;
    return { ...rest, assigneeId: originalId, status: "pending" };
  }
  return { ...task, assigneeId: newAssigneeId, swappedFromId: originalId, status: "swapped" };
}
