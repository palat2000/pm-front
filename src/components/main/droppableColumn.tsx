import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DraggableTask from "@/components/main/draggableTask";

export default function DroppableColumn() {
  return (
    <Card
      //   ref={drop}
      className={`flex-1 min-w-80 max-w-100 relative h-full gap-3`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          title
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
            0
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 overflow-auto">
        <DraggableTask />
        <DraggableTask />
        <DraggableTask />
        <DraggableTask />
        <DraggableTask />
        <DraggableTask />
        {/* {column.tasks.map((task) => (
          <DraggableTask key={task.id} task={task} onTaskClick={onTaskClick} />
        ))} */}
      </CardContent>
      <div className="absolute bottom-2 right-2">
        <Button variant="outline">เพิ่มการ์ด</Button>
      </div>
    </Card>
  );
}
