import TaskCard from "@/components/main/taskCard";
import { TaskCard as TaskCarModel } from "@/stores/project-store";

export default function DraggableTask({
  task,
  onSelectTask,
}: {
  task: TaskCarModel;
  onSelectTask: (task: TaskCarModel) => void;
}) {
  return (
    <div>
      <TaskCard task={task} onSelectTask={onSelectTask} />
    </div>
  );
}
