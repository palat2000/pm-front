import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/main/sidebarApp";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
