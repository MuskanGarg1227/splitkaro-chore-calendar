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
  /** Display time, e.g. "8:30 PM" */
  reminder?: string;
  /** Shared by every occurrence of a recurring task */
  seriesId?: string;
  /** e.g. "Every Monday until 28 Dec" */
  repeatLabel?: string;
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

/* ---------- Dates (YYYY-MM-DD strings, timezone-safe) ---------- */

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const FULL_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parseISO(d: string): Date {
  const [y = 1970, m = 1, day = 1] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}
function toISO(dt: Date): string {
  return dt.toISOString().slice(0, 10);
}

export function addDays(d: string, n: number): string {
  const dt = parseISO(d);
  dt.setUTCDate(dt.getUTCDate() + n);
  return toISO(dt);
}

/** 0 = Monday … 6 = Sunday */
export function weekdayIndex(d: string): number {
  return (parseISO(d).getUTCDay() + 6) % 7;
}

export function startOfWeek(d: string): string {
  return addDays(d, -weekdayIndex(d));
}

export type WeekDay = { date: string; weekday: string; day: number; month: string };

export function weekDays(anchor: string): WeekDay[] {
  const monday = startOfWeek(anchor);
  return WEEKDAYS.map((weekday, i) => {
    const date = addDays(monday, i);
    const dt = parseISO(date);
    return { date, weekday, day: dt.getUTCDate(), month: MONTHS[dt.getUTCMonth()]! };
  });
}

/** "Sunday, 22 Nov" (short) or "Sunday, 22 November" (long) */
export function formatDayLabel(d: string, style: "short" | "long" = "short"): string {
  const dt = parseISO(d);
  const month = (style === "short" ? MONTHS : FULL_MONTHS)[dt.getUTCMonth()];
  return `${FULL_WEEKDAYS[weekdayIndex(d)]}, ${dt.getUTCDate()} ${month}`;
}

/** "16 – 22 Nov 2026" or "30 Nov – 6 Dec 2026" */
export function formatWeekRange(anchor: string): string {
  const days = weekDays(anchor);
  const first = parseISO(days[0]!.date);
  const last = parseISO(days[6]!.date);
  const fm = MONTHS[first.getUTCMonth()];
  const lm = MONTHS[last.getUTCMonth()];
  const fy = first.getUTCFullYear();
  const ly = last.getUTCFullYear();
  if (fy !== ly) return `${first.getUTCDate()} ${fm} ${fy} – ${last.getUTCDate()} ${lm} ${ly}`;
  if (fm !== lm) return `${first.getUTCDate()} ${fm} – ${last.getUTCDate()} ${lm} ${ly}`;
  return `${first.getUTCDate()} – ${last.getUTCDate()} ${lm} ${ly}`;
}

/* ---------- Creating tasks ---------- */

export type RepeatFrequency = "daily" | "weekly" | "custom";

export type Recurrence = {
  frequency: RepeatFrequency;
  /** Weekday indexes (0 = Mon). Ignored for daily. */
  days: number[];
  startDate: string;
  endDate?: string;
};

/** Without an end date, recurring tasks are scheduled this many days ahead. */
export const RECURRING_HORIZON_DAYS = 84;

export function recurrenceDates(r: Recurrence, horizonDays = RECURRING_HORIZON_DAYS): string[] {
  const last = r.endDate ?? addDays(r.startDate, horizonDays - 1);
  const out: string[] = [];
  for (let d = r.startDate; d <= last && out.length < 400; d = addDays(d, 1)) {
    if (r.frequency === "daily" || r.days.includes(weekdayIndex(d))) out.push(d);
  }
  return out;
}

export function repeatLabel(r: Recurrence): string {
  const sorted = [...r.days].sort((a, b) => a - b);
  let base: string;
  if (r.frequency === "daily") base = "Every day";
  else if (sorted.length === 1) base = `Every ${FULL_WEEKDAYS[sorted[0]!]}`;
  else base = `Every ${sorted.map((i) => WEEKDAYS[i]).join(", ")}`;
  if (!r.endDate) return base;
  const end = parseISO(r.endDate);
  return `${base} until ${end.getUTCDate()} ${MONTHS[end.getUTCMonth()]}`;
}

export type TaskFormValues = {
  type: "one-off" | "recurring";
  title: string;
  description: string;
  assigneeId: string;
  /** One-off date */
  date: string;
  /** "HH:MM" */
  time: string;
  /** "HH:MM" or "" */
  reminder: string;
  frequency: RepeatFrequency;
  days: number[];
  startDate: string;
  endDate: string;
};

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

export function emptyTaskForm(date: string): TaskFormValues {
  return {
    type: "one-off",
    title: "",
    description: "",
    assigneeId: "",
    date,
    time: "",
    reminder: "",
    frequency: "weekly",
    days: [weekdayIndex(date)],
    startDate: date,
    endDate: "",
  };
}

function toRecurrence(v: TaskFormValues): Recurrence {
  const r: Recurrence = { frequency: v.frequency, days: v.days, startDate: v.startDate };
  return v.endDate ? { ...r, endDate: v.endDate } : r;
}

export function validateTaskForm(v: TaskFormValues): TaskFormErrors {
  const e: TaskFormErrors = {};
  const title = v.title.trim();
  if (!title) e.title = "Give the task a name";
  else if (title.length > 60) e.title = "Keep the name under 60 characters";
  if (v.description.trim().length > 140) e.description = "Keep the description under 140 characters";
  if (!FLATMATES.some((f) => f.id === v.assigneeId)) e.assigneeId = "Choose who's doing this";
  if (!v.time) e.time = "Add a due time";
  if (v.reminder && v.time && v.reminder >= v.time) e.reminder = "Reminder must be before the due time";

  if (v.type === "one-off") {
    if (!v.date) e.date = "Pick a date";
  } else {
    if (!v.startDate) e.startDate = "Pick a start date";
    if (v.frequency === "weekly" && v.days.length !== 1) e.days = "Pick the day it repeats on";
    if (v.frequency === "custom" && v.days.length === 0) e.days = "Pick at least one day";
    if (v.endDate && v.startDate && v.endDate < v.startDate) e.endDate = "End date can't be before the start date";
    if (!e.startDate && !e.days && !e.endDate && recurrenceDates(toRecurrence(v)).length === 0) {
      e.days = "None of these days fall between the start and end date";
    }
  }
  return e;
}

/** Best-guess icon from the task name, incl. common Hinglish words. */
export function guessKind(title: string): TaskKind {
  const t = title.toLowerCase();
  const rules: [TaskKind, RegExp][] = [
    ["laundry", /laundry|kapd|wash(ing)? clothes/],
    ["groceries", /grocer|sabzi|kirana|vegetable|milk|doodh|dmart|blinkit/],
    ["garbage", /garbage|kachra|trash|bin|dustbin/],
    ["kitchen", /kitchen|dish|bartan|utensil|cook|chimney/],
    ["water", /water|bisleri|\bcan/],
    ["plants", /plant|garden/],
    ["bathroom", /bathroom|toilet|washroom/],
    ["ironing", /iron|istri|press/],
    ["mop", /mop|jhadu|pocha|sweep|dust/],
  ];
  return rules.find(([, re]) => re.test(t))?.[0] ?? "other";
}

/** Turns a valid form into one task (one-off) or one task per date (recurring), all Pending. */
export function buildTasksFromForm(v: TaskFormValues, makeId: () => string): Task[] {
  const description = v.description.trim();
  const base = {
    title: v.title.trim(),
    kind: guessKind(v.title),
    assigneeId: v.assigneeId,
    time: formatTime(v.time),
    status: "pending" as const,
    ...(description ? { note: description } : {}),
    ...(v.reminder ? { reminder: formatTime(v.reminder) } : {}),
  };
  if (v.type === "one-off") return [{ ...base, id: makeId(), date: v.date }];

  const r = toRecurrence(v);
  const seriesId = makeId();
  const label = repeatLabel(r);
  return recurrenceDates(r).map((date, i) => ({
    ...base,
    id: `${seriesId}-${i}`,
    date,
    seriesId,
    repeatLabel: label,
  }));
}
