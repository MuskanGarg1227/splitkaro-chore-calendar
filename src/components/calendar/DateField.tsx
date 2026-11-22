import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function toDate(v: string): Date | undefined {
  if (!v) return undefined;
  const [y = 1970, m = 1, d = 1] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toValue(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function DateField({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  invalid,
  minDate,
  clearable,
  describedBy,
  compact,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean | undefined;
  /** YYYY-MM-DD; earlier days are disabled */
  minDate?: string;
  clearable?: boolean;
  describedBy?: string | undefined;
  /** Drop the year so the date fits a half-width field */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const min = toDate(minDate ?? "");

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              "field-input flex items-center gap-2 text-left",
              !selected && "text-muted-foreground",
              invalid && "field-invalid",
              clearable && value && "pr-9",
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{selected ? format(selected, compact ? "EEE, d MMM" : "EEE, d MMM yyyy") : placeholder}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-2xl p-0" align="start">
          <Calendar
            mode="single"
            {...(selected ? { selected } : {})}
            {...(selected || min ? { defaultMonth: (selected ?? min)! } : {})}
            onSelect={(d) => {
              if (d) onChange(toValue(d));
              setOpen(false);
            }}
            {...(min ? { disabled: { before: min } } : {})}
            weekStartsOn={1}
            initialFocus
            className={cn("pointer-events-auto p-3")}
          />
        </PopoverContent>
      </Popover>
      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear date"
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
