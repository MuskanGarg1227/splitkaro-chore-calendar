import { describe, expect, it } from "vitest";
import {
  SAMPLE_TASKS,
  TODAY,
  completionPercent,
  setTaskDone,
  summarizeTasks,
  swapTask,
} from "@/lib/calendar-data";

const today = SAMPLE_TASKS.filter((t) => t.date === TODAY);
const find = (title: string) => {
  const t = today.find((x) => x.title === title);
  if (!t) throw new Error(`missing ${title}`);
  return t;
};

describe("task summary", () => {
  it("counts today's sample tasks by status", () => {
    expect(summarizeTasks(today)).toEqual({ total: 4, done: 1, pending: 1, overdue: 1, swapped: 1 });
  });

  it("sample data covers all four statuses", () => {
    const statuses = new Set(SAMPLE_TASKS.map((t) => t.status));
    expect([...statuses].sort()).toEqual(["done", "overdue", "pending", "swapped"]);
  });

  it("completion updates when a task is marked done", () => {
    expect(completionPercent(summarizeTasks(today))).toBe(25);
    const kitchen = find("Clean kitchen");
    const updated = today.map((t) => (t.id === kitchen.id ? setTaskDone(t, true) : t));
    expect(summarizeTasks(updated).done).toBe(2);
    expect(completionPercent(summarizeTasks(updated))).toBe(50);
  });

  it("completion is 0 for a day with no tasks", () => {
    expect(completionPercent(summarizeTasks([]))).toBe(0);
  });
});

describe("swapping", () => {
  it("records the original and new assignee", () => {
    const swapped = swapTask(find("Clean kitchen"), "lakshay");
    expect(swapped.assigneeId).toBe("lakshay");
    expect(swapped.swappedFromId).toBe("muskan");
    expect(swapped.status).toBe("swapped");
  });

  it("un-doing a swapped task returns it to Swapped, not Pending", () => {
    const groceries = find("Buy groceries");
    expect(setTaskDone(setTaskDone(groceries, true), false).status).toBe("swapped");
  });

  it("swapping back to the original assignee clears the swap", () => {
    const back = swapTask(find("Buy groceries"), "muskan");
    expect(back.assigneeId).toBe("muskan");
    expect(back.swappedFromId).toBeUndefined();
    expect(back.status).toBe("pending");
  });
});
