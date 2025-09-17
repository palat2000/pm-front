"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useStore } from "zustand";
import { userStore } from "@/stores/user-store";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Project, projectStore } from "@/stores/project-store";

export default function SidebarApp() {
  const user = useStore(userStore, (s) => s.user);
  const selectProject = useStore(projectStore, (s) => s.selectProject);
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const [items, setItems] = useState<Project[]>([]);
  const onSelectProject = (id: number) => {
    if (projectSelected?.id === id) {
      return;
    }
    const item = items.filter((f) => f.id === id)[0];
    selectProject(item);
  };

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get("/projects");
      const projects = response.data.map(
        (item: any): Project => ({
          description: item.description,
          id: item.id,
          name: item.name,
          members: item.members,
          boards: item.boards,
        })
      );
      setItems(projects);
    };
    if (user) {
      fetchItems();
    }
  }, [user]);

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    onClick={() => {
                      onSelectProject(item.id);
                    }}
                    className="cursor-pointer"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={item.id === projectSelected?.id}
                    >
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Separator className="my-4" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
