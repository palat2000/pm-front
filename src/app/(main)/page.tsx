"use client";
import DroppableColumn from "@/components/main/droppableColumn";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Users } from "lucide-react";
import { useStore } from "zustand";
import { useEffect } from "react";
import { Column, projectStore, TaskCard } from "@/stores/project-store";
import { useState } from "react";
import axios from "@/lib/axios";
import TaskDialog from "@/components/main/taskDialog";

export default function Page() {
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const setSelectedBoardColumns = useStore(
    projectStore,
    (s) => s.setSelectedBoardColumns
  );
  const columns = useStore(projectStore, (s) => s.boardSelectedColumns);
  const [taskSelected, setTaskSelected] = useState<TaskCard | null>(
    {} as TaskCard
  );
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const onSelectTask = (task: TaskCard) => {
    setIsTaskDialogOpen(true);
    setTaskSelected(task);
  };

  useEffect(() => {
    if (projectSelected) {
      const board = projectSelected.boards[0];
      const fetchColumns = async () => {
        const response = await axios.get(`/columns/board/${board.id}`);
        const columns = response.data;
        setSelectedBoardColumns(columns);
      };
      fetchColumns();
    }
  }, [projectSelected]);

  return (
    <>
      <main className="flex-1 p-6 flex flex-col overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1>แดชบอร์ด</h1>
          </div>
        </div>

        <div className="space-y-6 flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-2">{projectSelected?.name}</h2>
              <p className="text-muted-foreground">
                {projectSelected?.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                สมาชิก ({projectSelected?.members?.length})
              </Button>
              <Button className="cursor-pointer">
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="flex gap-6 h-full">
              {columns.map((col) => (
                <DroppableColumn
                  key={col.id}
                  column={col}
                  onSelectTask={onSelectTask}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <TaskDialog
        task={taskSelected}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projectId={projectSelected?.id || 0}
      />
    </>
  );
}
