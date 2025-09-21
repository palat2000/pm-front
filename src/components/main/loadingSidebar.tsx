import { SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuSkeleton } from "@/components/ui/sidebar";

export default function LoadingSidebar() {
  return Array.from({ length: 10 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton showIcon />
    </SidebarMenuItem>
  ));
}
