import { LayoutGrid, Package, Heart, MapPin, CreditCard, Settings } from "lucide-react";

export const accountLinks = [
  { to: "/account", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/account/orders", label: "Orders", icon: Package, end: false },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart, end: false },
  { to: "/account/addresses", label: "Addresses", icon: MapPin, end: false },
  { to: "/account/payment", label: "Payment Methods", icon: CreditCard, end: false },
  { to: "/account/settings", label: "Settings", icon: Settings, end: false },
];
