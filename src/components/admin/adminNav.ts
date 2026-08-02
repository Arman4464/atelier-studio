import { LayoutDashboard, Package, Boxes, Users, Tag, BarChart3, Settings } from "lucide-react";

export const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: Package, end: false },
  { to: "/admin/products", label: "Products", icon: Boxes, end: false },
  { to: "/admin/customers", label: "Customers", icon: Users, end: false },
  { to: "/admin/discounts", label: "Discounts", icon: Tag, end: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, end: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, end: false },
];
