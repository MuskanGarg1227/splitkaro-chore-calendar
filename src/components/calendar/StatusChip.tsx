import { AlertCircle, ArrowLeftRight, Check, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/calendar-data";

const CONFIG: Record<TaskStatus, { label: string; className: string; Icon: typeof Check }> = {
  pending: { label: "Pending", className: "bg-status-pending-soft text-status-pending", Icon: Clock3 },
  done: { label: "Done", className: "bg-status-done-soft text-status-done", Icon: Check },
  swapped: { label: "Swapped", className: "bg-status-swapped-soft text-status-swapped", Icon: ArrowLeftRight },
  overdue: { label: "Overdue", className: "bg-status-overdue-soft text-status-overdue", Icon: AlertCircle },
};

export function StatusChip({ status }: { status: TaskStatus }) {
  const { label, className, Icon } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.75} />
      {label}
    </span>
  );
}
