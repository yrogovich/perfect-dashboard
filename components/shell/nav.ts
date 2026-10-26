import { CalendarDays, ChartLine, FileText, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Order defines slide direction: moving down the list is "forward".
export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/posts", label: "Content", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: ChartLine },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/authors", label: "Authors", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function navIndex(pathname: string) {
  const i = navItems.findIndex((item) => item.href !== "/" && pathname.startsWith(item.href));
  return i === -1 ? 0 : i;
}

export function directionTo(from: number, to: number) {
  return to > from ? ["nav-forward"] : to < from ? ["nav-back"] : [];
}
