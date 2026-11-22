import { CalendarDays, ChartColumn, House, ReceiptIndianRupee, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", Icon: House },
  { label: "Groups", Icon: Users },
  { label: "Calendar", Icon: CalendarDays, active: true },
  { label: "Analytics", Icon: ChartColumn },
  { label: "Bills", Icon: ReceiptIndianRupee },
  { label: "Balances", Icon: Wallet },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t bg-background/95 px-1 pt-1.5 shadow-nav backdrop-blur"
    >
      <ul className="grid grid-cols-6">
        {ITEMS.map(({ label, Icon, active }) => (
          <li key={label}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => !active && toast(`${label} lives in the main Splitkaro app`)}
              className={cn(
                "flex w-full flex-col items-center gap-1 py-1 text-[10px] font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-full transition-colors",
                  active && "bg-primary-soft",
                )}
              >
                <Icon className="size-[19px]" strokeWidth={active ? 2.5 : 2} />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
