import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck2, ChevronDown, Repeat, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  FLATMATES,
  QUICK_TASKS,
  WEEKDAYS,
  CURRENT_USER_ID,
  emptyTaskForm,
  recurrenceDates,
  repeatLabel,
  validateTaskForm,
  weekdayIndex,
  type RepeatFrequency,
  type TaskFormErrors,
  type TaskFormValues,
} from "@/lib/calendar-data";
import { DateField } from "./DateField";

const FIELD_ORDER: (keyof TaskFormValues)[] = [
  "title",
  "description",
  "assigneeId",
  "date",
  "days",
  "startDate",
  "endDate",
  "time",
  "reminder",
];

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-muted-foreground">
      {children}
      {optional ? <span className="font-normal"> (optional)</span> : <span className="text-destructive"> *</span>}
    </label>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-9 rounded-lg text-sm font-semibold transition-colors",
            value === o.value ? "bg-background text-primary shadow-card" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function AddTaskDrawer({
  open,
  onOpenChange,
  defaultDate,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
  onCreate: (values: TaskFormValues) => void;
}) {
  const [values, setValues] = useState<TaskFormValues>(() => emptyTaskForm(defaultDate));
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fresh form every time the sheet opens.
  useEffect(() => {
    if (open) {
      setValues(emptyTaskForm(defaultDate));
      setSubmitted(false);
    }
  }, [open, defaultDate]);

  const errors: TaskFormErrors = useMemo(() => (submitted ? validateTaskForm(values) : {}), [submitted, values]);
  const recurring = values.type === "recurring";

  const occurrenceCount = useMemo(() => {
    if (!recurring || !values.startDate) return 0;
    if (values.frequency !== "daily" && values.days.length === 0) return 0;
    if (values.endDate && values.endDate < values.startDate) return 0;
    const r = { frequency: values.frequency, days: values.days, startDate: values.startDate };
    return recurrenceDates(values.endDate ? { ...r, endDate: values.endDate } : r).length;
  }, [recurring, values.frequency, values.days, values.startDate, values.endDate]);

  function set<K extends keyof TaskFormValues>(key: K, v: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function setFrequency(f: RepeatFrequency) {
    setValues((prev) => {
      let days = prev.days;
      const fallback = weekdayIndex(prev.startDate || prev.date || defaultDate);
      if (f === "weekly") days = [days[0] ?? fallback];
      if (f === "custom" && days.length === 0) days = [fallback];
      return { ...prev, frequency: f, days };
    });
  }

  function toggleDay(i: number) {
    setValues((prev) => {
      if (prev.frequency === "weekly") return { ...prev, days: [i] };
      const days = prev.days.includes(i) ? prev.days.filter((d) => d !== i) : [...prev.days, i];
      return { ...prev, days: days.sort((a, b) => a - b) };
    });
  }

  function setType(type: TaskFormValues["type"]) {
    setValues((prev) => {
      // Carry the chosen date across so switching types doesn't lose it.
      if (type === "recurring") {
        const start = prev.startDate || prev.date;
        return { ...prev, type, startDate: start, days: prev.days.length ? prev.days : [weekdayIndex(start)] };
      }
      return { ...prev, type, date: prev.date || prev.startDate };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const found = validateTaskForm(values);
    const firstKey = FIELD_ORDER.find((k) => found[k]);
    if (firstKey) {
      requestAnimationFrame(() => {
        const el = scrollRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.querySelector<HTMLElement>("input, textarea, select, button")?.focus({ preventScroll: true });
      });
      return;
    }
    onCreate(values);
    onOpenChange(false);
  }

  const err = (k: keyof TaskFormValues) => errors[k];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent className="mx-auto h-[94dvh] max-w-[430px] rounded-t-3xl border-0">
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b px-5 pb-3 pt-2">
            <div>
              <DrawerTitle className="text-lg font-extrabold">New task</DrawerTitle>
              <DrawerDescription className="text-xs">Flat 4 · everyone will see it on the calendar</DrawerDescription>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close without saving"
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            {/* Type */}
            <div role="radiogroup" aria-label="Task type" className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "one-off", label: "One-off task", hint: "Happens once", Icon: CalendarCheck2 },
                  { value: "recurring", label: "Recurring task", hint: "Repeats on a schedule", Icon: Repeat },
                ] as const
              ).map(({ value, label, hint, Icon }) => {
                const active = values.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setType(value)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-colors",
                      active ? "border-primary bg-primary-soft" : "border-border bg-background",
                    )}
                  >
                    <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-bold">{label}</span>
                    <span className="text-[11px] text-muted-foreground">{hint}</span>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <div data-field="title">
              <Label htmlFor="task-title">Task title</Label>
              <input
                id="task-title"
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Take out garbage"
                maxLength={80}
                aria-invalid={!!err("title") || undefined}
                aria-describedby={err("title") ? "task-title-error" : undefined}
                className={cn("field-input", err("title") && "field-invalid")}
              />
              <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5">
                {QUICK_TASKS.map((q) => (
                  <button
                    key={q.title}
                    type="button"
                    onClick={() => set("title", q.title)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                      values.title === q.title ? "border-primary bg-primary-soft text-primary" : "text-muted-foreground",
                    )}
                  >
                    {q.title}
                  </button>
                ))}
              </div>
              <FieldError id="task-title-error" message={err("title")} />
            </div>

            {/* Description */}
            <div data-field="description">
              <Label htmlFor="task-desc" optional>
                Description
              </Label>
              <textarea
                id="task-desc"
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="e.g. Wet & dry bins — kachra gaadi comes by 7:30"
                rows={2}
                maxLength={160}
                className={cn("field-input h-auto resize-none py-2.5 text-sm", err("description") && "field-invalid")}
              />
              <FieldError id="task-desc-error" message={err("description")} />
            </div>

            {/* Assignee */}
            <div data-field="assigneeId">
              <Label htmlFor="task-assignee">Assigned flatmate</Label>
              <div className="relative">
                <select
                  id="task-assignee"
                  value={values.assigneeId}
                  onChange={(e) => set("assigneeId", e.target.value)}
                  aria-invalid={!!err("assigneeId") || undefined}
                  aria-describedby={err("assigneeId") ? "task-assignee-error" : undefined}
                  className={cn(
                    "field-input appearance-none pr-10",
                    !values.assigneeId && "text-muted-foreground",
                    err("assigneeId") && "field-invalid",
                  )}
                >
                  <option value="" disabled>
                    Choose a flatmate
                  </option>
                  {FLATMATES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                      {m.id === CURRENT_USER_ID ? " (you)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <FieldError id="task-assignee-error" message={err("assigneeId")} />
            </div>

            {/* Date / recurrence */}
            {!recurring ? (
              <div data-field="date">
                <Label htmlFor="task-date">Date</Label>
                <DateField
                  id="task-date"
                  value={values.date}
                  onChange={(v) => set("date", v)}
                  invalid={!!err("date")}
                  describedBy={err("date") ? "task-date-error" : undefined}
                />
                <FieldError id="task-date-error" message={err("date")} />
              </div>
            ) : (
              <div className="space-y-4 rounded-2xl border bg-surface p-3.5">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Repeat <span className="text-destructive">*</span>
                  </p>
                  <Segmented
                    label="Repeat frequency"
                    value={values.frequency}
                    onChange={setFrequency}
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "custom", label: "Custom days" },
                    ]}
                  />
                </div>

                {values.frequency !== "daily" && (
                  <div data-field="days">
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {values.frequency === "weekly" ? "Repeats every" : "Repeats on"}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <div
                      role="group"
                      aria-label={values.frequency === "weekly" ? "Day of the week" : "Days of the week"}
                      className="grid grid-cols-7 gap-1.5"
                    >
                      {WEEKDAYS.map((d, i) => {
                        const on = values.days.includes(i);
                        return (
                          <button
                            key={d}
                            type="button"
                            aria-pressed={on}
                            aria-label={d}
                            onClick={() => toggleDay(i)}
                            className={cn(
                              "flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition-colors",
                              on
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground",
                              err("days") && !on && "border-destructive",
                            )}
                          >
                            {d.slice(0, 2)}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError id="task-days-error" message={err("days")} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div data-field="startDate" className="min-w-0">
                    <Label htmlFor="task-start">Start date</Label>
                    <DateField
                      id="task-start"
                      value={values.startDate}
                      onChange={(v) => set("startDate", v)}
                      placeholder="Start"
                      compact
                      invalid={!!err("startDate")}
                    />
                    <FieldError id="task-start-error" message={err("startDate")} />
                  </div>
                  <div data-field="endDate" className="min-w-0">
                    <Label htmlFor="task-end" optional>
                      End date
                    </Label>
                    <DateField
                      id="task-end"
                      value={values.endDate}
                      onChange={(v) => set("endDate", v)}
                      placeholder="No end"
                      compact
                      {...(values.startDate ? { minDate: values.startDate } : {})}
                      invalid={!!err("endDate")}
                      clearable
                    />
                    <FieldError id="task-end-error" message={err("endDate")} />
                  </div>
                </div>

                {occurrenceCount > 0 && (
                  <p className="flex items-center gap-1.5 rounded-xl bg-primary-soft px-3 py-2 text-xs font-semibold text-primary">
                    <Repeat className="size-3.5" />
                    {repeatLabel({
                      frequency: values.frequency,
                      days: values.days,
                      startDate: values.startDate,
                      ...(values.endDate ? { endDate: values.endDate } : {}),
                    })}{" "}
                    · {occurrenceCount} {occurrenceCount === 1 ? "date" : "dates"}
                    {!values.endDate && " (next 12 weeks)"}
                  </p>
                )}
              </div>
            )}

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
              <div data-field="time" className="min-w-0">
                <Label htmlFor="task-time">Due time</Label>
                <input
                  id="task-time"
                  type="time"
                  value={values.time}
                  onChange={(e) => set("time", e.target.value)}
                  aria-invalid={!!err("time") || undefined}
                  aria-describedby={err("time") ? "task-time-error" : undefined}
                  className={cn("field-input", !values.time && "text-muted-foreground", err("time") && "field-invalid")}
                />
                <FieldError id="task-time-error" message={err("time")} />
              </div>
              <div data-field="reminder" className="min-w-0">
                <Label htmlFor="task-reminder" optional>
                  Reminder
                </Label>
                <input
                  id="task-reminder"
                  type="time"
                  value={values.reminder}
                  onChange={(e) => set("reminder", e.target.value)}
                  aria-invalid={!!err("reminder") || undefined}
                  aria-describedby={err("reminder") ? "task-reminder-error" : undefined}
                  className={cn(
                    "field-input",
                    !values.reminder && "text-muted-foreground",
                    err("reminder") && "field-invalid",
                  )}
                />
                <FieldError id="task-reminder-error" message={err("reminder")} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pb-safe flex gap-3 border-t bg-background px-5 pt-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 rounded-full border text-[15px] font-bold text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 flex-[2] rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-fab active:scale-[0.98]"
            >
              Create Task
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
