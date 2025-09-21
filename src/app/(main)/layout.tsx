import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/main/sidebarApp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/app/(main)/userProvider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <UserProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          {children}
        </div>
      </SidebarProvider>
      <Toaster position="top-right" duration={1500} />
    </UserProvider>
  );
}
