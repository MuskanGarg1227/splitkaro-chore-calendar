import { CalendarDays, House, ReceiptIndianRupee, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", Icon: House },
  { label: "Groups", Icon: Users },
  { label: "Calendar", Icon: CalendarDays, active: true },
  { label: "Bills", Icon: ReceiptIndianRupee },
  { label: "Balances", Icon: Wallet },
];

export function BottomNav() {
  return (
    <nav aria-label="Main" className="pb-safe border-t bg-background px-2 pt-1">
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ label, Icon, active }) => (
          <li key={label}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => !active && toast(`${label} lives in the main Splitkaro app`)}
              className={cn(
                "flex w-full flex-col items-center gap-0.5 py-1 text-[11px] font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active && "bg-primary-soft",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
