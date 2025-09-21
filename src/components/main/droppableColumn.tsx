import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DraggableTask from "@/components/main/draggableTask";
import { Column, TaskCard } from "@/stores/project-store";
import { Separator } from "@/components/ui/separator";

export default function DroppableColumn({
  column,
  onSelectTask,
}: {
  column: Column;
  onSelectTask: (task: TaskCard) => void;
}) {
  return (
    <Card
      //   ref={drop}
      className={`flex-1 min-w-80 max-w-100 h-full gap-3`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {column.name}
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
            {column.tasks?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      {!!column.tasks?.length && (
        <CardContent className="space-y-3 overflow-auto">
          {column.tasks?.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onSelectTask={onSelectTask}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
