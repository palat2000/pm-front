import TaskCard from "@/components/main/taskCard";
import { Task } from "@/stores/project-store";

export default function DraggableTask({
  task,
  onSelectTask,
}: {
  task: Task;
  onSelectTask: (task: Task) => void;
}) {
  return (
    <div>
      <TaskCard task={task} onSelectTask={onSelectTask} />
    </div>
  );
}
