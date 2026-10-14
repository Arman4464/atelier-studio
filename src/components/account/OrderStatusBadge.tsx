import React from "react";
import type { OrderStatus } from "../../store/authStore";
import { cn } from "../../lib/cn";

const statusConfig: Record<OrderStatus, { dot: string; bg: string; text: string }> = {
  Processing: {
    dot: "bg-amber-400 animate-pulse",
    bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300",
    text: "Processing",
  },
  Shipped: {
    dot: "bg-purple-400 animate-pulse",
    bg: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-300",
    text: "Shipped",
  },
  Delivered: {
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    text: "Delivered",
  },
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Processing;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border backdrop-blur-md shadow-xs",
        config.bg
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.text}
    </span>
  );
};

export default OrderStatusBadge;
