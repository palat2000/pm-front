"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { ProjectSelected, projectStore } from "@/stores/project-store";
import AddProjectDialog from "@/components/main/addProjectDialog";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ChevronUp, Plus } from "lucide-react";
import LoadingSidebar from "@/components/main/loadingSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { userStore } from "@/stores/user-store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

export default function SidebarApp() {
  const user = useStore(userStore, (s) => s.user);
  const selectProject = useStore(projectStore, (s) => s.selectProject);
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const [items, setItems] = useState<ProjectSelected[]>([]);
  const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSelectProject = (project: ProjectSelected) => {
    selectProject(project);
  };
  const onAddProject = async (addProjectForm: {
    name: string;
    description: string;
    color: string;
  }) => {
    const res = await axios.post("projects", addProjectForm);
    setItems((prevItems: ProjectSelected[]) => [...prevItems, res.data]);
  };
  const onLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("projects");
        setItems(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                  <LoadingSidebar />
                ) : (
                  items.map((item) => (
                    <SidebarMenuItem
                      key={item.id}
                      onClick={() => {
                        onSelectProject(item);
                      }}
                    >
                      <SidebarMenuButton
                        isActive={item.id === projectSelected?.id}
                        className="cursor-pointer"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mr-2`}
                          style={{ backgroundColor: item.color || "#000000" }}
                        />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {!isLoading && (
            <>
              <Separator className="mb-4" />
              <Button
                className="w-full cursor-pointer"
                onClick={() => setOpenAddProjectDialog(true)}
              >
                <Plus className="w-6 h-6" />
                เพิ่ม
              </Button>
            </>
          )}

          <AddProjectDialog
            open={openAddProjectDialog}
            onChangeOpen={setOpenAddProjectDialog}
            onAddProject={onAddProject}
          />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <Avatar>
                    <AvatarFallback>
                      {user!.name!.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user!.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
