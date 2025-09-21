import { useStore } from "zustand";
import { Button } from "../ui/button";
import BoardCombobox from "./boardCombobox";
import { projectStore, TaskCard } from "@/stores/project-store";
import DroppableColumn from "./droppableColumn";
import { Plus, Users } from "lucide-react";

export default function ProjectIndex({
  setIsMemberDialogOpen,
  setIsColumnDialogOpen,
  onSelectTask,
  setIsAddBoardDialogOpen,
}: {
  setIsMemberDialogOpen: (open: boolean) => void;
  setIsColumnDialogOpen: (open: boolean) => void;
  onSelectTask: (task: TaskCard) => void;
  setIsAddBoardDialogOpen: (open: boolean) => void;
}) {
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const boardSelected = useStore(projectStore, (s) => s.boardSelected);
  const columns = useStore(projectStore, (s) => s.boardSelectedColumns);

  return (
    <div className="space-y-4 flex flex-col flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">{projectSelected?.name}</h2>
          <p className="text-muted-foreground">
            {projectSelected?.description}
          </p>
        </div>
        <div className="flex gap-2">
          <BoardCombobox setIsAddBoardDialogOpen={setIsAddBoardDialogOpen} />
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setIsMemberDialogOpen(true);
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            สมาชิก ({projectSelected?.members?.length})
          </Button>
        </div>
      </div>
      {!boardSelected ? (
        <div className="flex flex-1 items-center justify-center">
          <h1>กรุณาเลือกบอร์ด</h1>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button
                className="cursor-pointer flex-1"
                onClick={() =>
                  onSelectTask({
                    id: 0,
                    assigneeId: null,
                    assigneeName: "",
                    columnId: 0,
                    description: "",
                    dueDate: null,
                    title: "",
                  })
                }
              >
                <Plus className="w-4 h-4" />
                เพิ่มการ์ด
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsColumnDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                เพิ่มรายการใหม่
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
        </>
      )}
    </div>
  );
}
