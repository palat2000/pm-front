"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useStore } from "zustand";
import { useEffect } from "react";
import { projectStore, TaskCard } from "@/stores/project-store";
import { useState } from "react";
import axios from "@/lib/axios";
import TaskDialog from "@/components/main/taskDialog";
import ProjectMemberDialog from "@/components/main/projectMemberDialog";
import ColumnDialog from "@/components/main/columnDialog";
import HomePlaceHolder from "@/components/main/homePlaceHolder";
import ProjectIndex from "@/components/main/projectIndex";
import AddBoardDialog from "@/components/main/addBoardDialog";

export default function Page() {
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const selectBoard = useStore(projectStore, (s) => s.selectBoard);
  const boardSelected = useStore(projectStore, (s) => s.boardSelected);
  const setSelectedBoardColumns = useStore(
    projectStore,
    (s) => s.setSelectedBoardColumns
  );
  const [taskSelected, setTaskSelected] = useState<TaskCard | null>(
    {} as TaskCard
  );
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isAddBoardDialogOpen, setIsAddBoardDialogOpen] = useState(false);
  const onSelectTask = (task: TaskCard) => {
    setIsTaskDialogOpen(true);
    setTaskSelected(task);
  };

  useEffect(() => {
    if (projectSelected) {
      selectBoard(null);
      setSelectedBoardColumns([]);
      if (projectSelected.boards.length > 0) {
        const board = projectSelected.boards[0];
        selectBoard(board);
        const fetchColumns = async () => {
          const response = await axios.get(`/columns/board/${board.id}`);
          const columns = response.data;
          setSelectedBoardColumns(columns);
        };
        fetchColumns();
      }
    }
  }, [projectSelected]);

  useEffect(() => {
    if (boardSelected) {
      const fetchColumns = async () => {
        const response = await axios.get(`/columns/board/${boardSelected.id}`);
        const columns = response.data;
        setSelectedBoardColumns(columns);
      };
      fetchColumns();
    }
  }, [boardSelected]);

  return (
    <>
      <main className="flex-1 p-6 flex flex-col overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1>แดชบอร์ด</h1>
          </div>
        </div>

        {!projectSelected ? (
          <HomePlaceHolder />
        ) : (
          <ProjectIndex
            setIsMemberDialogOpen={setIsMemberDialogOpen}
            setIsColumnDialogOpen={setIsColumnDialogOpen}
            onSelectTask={onSelectTask}
            setIsAddBoardDialogOpen={setIsAddBoardDialogOpen}
          />
        )}
      </main>

      <TaskDialog
        task={taskSelected}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projectId={projectSelected?.id || 0}
      />

      <ProjectMemberDialog
        open={isMemberDialogOpen}
        onOpenChange={setIsMemberDialogOpen}
      />

      <ColumnDialog
        open={isColumnDialogOpen}
        onOpenChange={setIsColumnDialogOpen}
      />

      <AddBoardDialog
        open={isAddBoardDialogOpen}
        onOpenChange={setIsAddBoardDialogOpen}
      />
    </>
  );
}
