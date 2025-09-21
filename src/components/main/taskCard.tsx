import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { TaskCard as TaskCardModel } from "@/stores/project-store";
import { formatDate } from "date-fns";
import { th } from "date-fns/locale";

export default function TaskCard({
  task,
  onSelectTask,
}: {
  task: TaskCardModel;
  onSelectTask: (task: TaskCardModel) => void;
}) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-200 py-3`}
      onClick={() => onSelectTask(task)}
    >
      <CardContent className="px-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {task.assigneeName && (
                <>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {task.assigneeName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {task.assigneeName}
                  </span>
                </>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.dueDate, "dd MMM yyyy", { locale: th })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
