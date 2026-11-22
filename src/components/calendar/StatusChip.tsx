import { AlertCircle, ArrowLeftRight, Check, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/calendar-data";

export const STATUS_META: Record<
  TaskStatus,
  { label: string; chip: string; text: string; solid: string; Icon: typeof Check }
> = {
  pending: {
    label: "Pending",
    chip: "bg-status-pending-soft text-status-pending",
    text: "text-status-pending",
    solid: "bg-status-pending",
    Icon: Clock3,
  },
  done: {
    label: "Done",
    chip: "bg-status-done-soft text-status-done",
    text: "text-status-done",
    solid: "bg-status-done",
    Icon: Check,
  },
  swapped: {
    label: "Swapped",
    chip: "bg-status-swapped-soft text-status-swapped",
    text: "text-status-swapped",
    solid: "bg-status-swapped",
    Icon: ArrowLeftRight,
  },
  overdue: {
    label: "Overdue",
    chip: "bg-status-overdue-soft text-status-overdue",
    text: "text-status-overdue",
    solid: "bg-status-overdue",
    Icon: AlertCircle,
  },
};

/** One badge style for every status: same height, padding, icon size. */
export function StatusChip({ status, className }: { status: TaskStatus; className?: string }) {
  const { label, chip, Icon } = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-semibold",
        chip,
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.75} />
      {label}
    </span>
  );
}
