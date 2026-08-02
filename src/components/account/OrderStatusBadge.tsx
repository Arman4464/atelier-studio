import type { OrderStatus } from "../../store/authStore";
import { cn } from "../../lib/cn";

const styles: Record<OrderStatus, string> = {
  Processing: "bg-zest text-on-zest",
  Shipped: "bg-indigo text-on-indigo",
  Delivered: "bg-indigo-glow text-void",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest", styles[status])}>
      {status}
    </span>
  );
}
