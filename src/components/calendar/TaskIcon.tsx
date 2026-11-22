import {
  Bath,
  Brush,
  ClipboardList,
  CookingPot,
  Droplets,
  Shirt,
  ShoppingBasket,
  Sprout,
  Trash2,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskKind } from "@/lib/calendar-data";

const KIND_ICON: Record<TaskKind, typeof Shirt> = {
  laundry: Shirt,
  groceries: ShoppingBasket,
  garbage: Trash2,
  kitchen: CookingPot,
  water: Droplets,
  plants: Sprout,
  bathroom: Bath,
  ironing: Wind,
  mop: Brush,
  other: ClipboardList,
};

export function TaskIcon({ kind, size = "md" }: { kind: TaskKind; size?: "md" | "lg" }) {
  const Icon = KIND_ICON[kind];
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary",
        size === "md" ? "size-10" : "size-12",
      )}
    >
      <Icon className="size-5" strokeWidth={2.2} />
    </span>
  );
}
