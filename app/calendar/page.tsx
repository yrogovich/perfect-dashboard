import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function Page() {
  return <ComingSoon title="Calendar" icon={CalendarDays} blurb="An editorial calendar where you drag posts to reschedule them." />;
}
