import { describe, expect, it } from "vitest";
import {
  RECURRING_HORIZON_DAYS,
  buildTasksFromForm,
  emptyTaskForm,
  recurrenceDates,
  summarizeTasks,
  SAMPLE_TASKS,
  validateTaskForm,
  type TaskFormValues,
} from "@/lib/calendar-data";

let n = 0;
const makeId = () => `id${++n}`;

const valid = (over: Partial<TaskFormValues> = {}): TaskFormValues => ({
  ...emptyTaskForm("2026-11-22"),
  title: "Order water cans",
  assigneeId: "mehak",
  time: "19:00",
  ...over,
});

describe("Add Task validation", () => {
  it("requires title, flatmate, date and due time", () => {
    const errors = validateTaskForm({ ...emptyTaskForm(""), date: "" });
    expect(Object.keys(errors).sort()).toEqual(["assigneeId", "date", "time", "title"]);
  });

  it("description and reminder are optional", () => {
    expect(validateTaskForm(valid())).toEqual({});
  });

  it("reminder must be before the due time", () => {
    expect(validateTaskForm(valid({ reminder: "19:30" })).reminder).toBeDefined();
    expect(validateTaskForm(valid({ reminder: "18:30" })).reminder).toBeUndefined();
  });

  it("recurring needs a start date and at least one day for custom", () => {
    const e = validateTaskForm(valid({ type: "recurring", frequency: "custom", days: [], startDate: "" }));
    expect(e.startDate).toBeDefined();
    expect(e.days).toBeDefined();
  });

  it("end date cannot be before start date", () => {
    const e = validateTaskForm(valid({ type: "recurring", startDate: "2026-11-22", endDate: "2026-11-20" }));
    expect(e.endDate).toBeDefined();
  });
});

describe("creating tasks", () => {
  it("one-off creates a single Pending task on the chosen date", () => {
    const tasks = buildTasksFromForm(valid({ date: "2026-11-19", reminder: "18:30" }), makeId);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ date: "2026-11-19", status: "pending", time: "7:00 PM", reminder: "6:30 PM", assigneeId: "mehak" });
  });

  it("weekly repeats on the chosen weekday", () => {
    const tasks = buildTasksFromForm(
      valid({ type: "recurring", frequency: "weekly", days: [0], startDate: "2026-11-16", endDate: "2026-11-30" }),
      makeId,
    );
    expect(tasks.map((t) => t.date)).toEqual(["2026-11-16", "2026-11-23", "2026-11-30"]);
    expect(tasks.every((t) => t.status === "pending" && t.seriesId === tasks[0]!.seriesId)).toBe(true);
  });

  it("custom days repeat on each selected weekday", () => {
    const dates = recurrenceDates({ frequency: "custom", days: [0, 2, 4], startDate: "2026-11-16", endDate: "2026-11-22" });
    expect(dates).toEqual(["2026-11-16", "2026-11-18", "2026-11-20"]);
  });

  it("daily covers every day from start to end", () => {
    const dates = recurrenceDates({ frequency: "daily", days: [], startDate: "2026-11-20", endDate: "2026-11-23" });
    expect(dates).toEqual(["2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"]);
  });

  it("without an end date, schedules up to the horizon", () => {
    const dates = recurrenceDates({ frequency: "daily", days: [], startDate: "2026-11-22" });
    expect(dates).toHaveLength(RECURRING_HORIZON_DAYS);
  });

  it("new tasks raise the day's total and pending counts", () => {
    const today = SAMPLE_TASKS.filter((t) => t.date === "2026-11-22");
    const added = [...today, ...buildTasksFromForm(valid(), makeId)];
    expect(summarizeTasks(added)).toMatchObject({ total: 5, pending: 2, done: 1 });
  });
});
