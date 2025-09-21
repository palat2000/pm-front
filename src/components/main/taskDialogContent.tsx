import { CalendarIcon, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format, formatDate } from "date-fns";
import { UserDdl } from "@/model/userDdl";
import { Column, Comment, Task, TaskCard } from "@/stores/project-store";
import { cn } from "@/lib/utils";
import { User } from "@/stores/user-store";
import TaskDialogButton from "@/components/main/taskDialogButton";

export default function TaskDialogContent({
  editedTask,
  setEditedTask,
  task,
  comments,
  assignees,
  newComment,
  setNewComment,
  handleAddComment,
  handelSubmitEditTask,
  user,
  onOpenChange,
  submitLoading,
  boardSelectedColumns,
  submitCommentLoading,
}: {
  editedTask: Task | null;
  setEditedTask: (task: Task | null) => void;
  task: TaskCard | null;
  comments: Comment[];
  assignees: UserDdl[];
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  handelSubmitEditTask: () => void;
  user: User | null;
  onOpenChange: (open: boolean) => void;
  submitLoading: boolean;
  boardSelectedColumns: Column[];
  submitCommentLoading: boolean;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>รายละเอียดงาน</DialogTitle>
        <DialogDescription>
          {task?.id ? "ดูและแก้ไขรายละเอียดงาน" : "สร้างงานใหม่"}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">ชื่องาน</Label>
              <Input
                id="title"
                value={editedTask?.title || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask!, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                className="resize-none min-h-45"
                id="description"
                value={editedTask?.description}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask!,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="lg:basis-[15rem] space-y-4">
            <Card className="h-full">
              <CardContent className="space-y-4 h-full flex flex-col gap-2">
                <div className="space-y-2 flex-1 lg:flex-none">
                  <Label htmlFor="column">รายการ</Label>
                  <Select
                    value={editedTask?.columnId?.toString()}
                    onValueChange={(value) => {
                      setEditedTask({
                        ...editedTask!,
                        columnId: Number(value),
                      });
                    }}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {boardSelectedColumns.map((col) => (
                        <SelectItem
                          key={col.id}
                          value={col.id.toString()}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{col.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex-1 lg:flex-none">
                  <Label htmlFor="dueDate">วันครบกำหนด</Label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !editedTask?.dueDate && "text-muted-foreground"
                          )}
                        >
                          {editedTask?.dueDate
                            ? format(editedTask?.dueDate, "dd/MM/yyyy")
                            : ""}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editedTask?.dueDate || undefined}
                          onSelect={(date) =>
                            setEditedTask({
                              ...editedTask!,
                              dueDate: date || null,
                            })
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2 flex-1 lg:flex-none">
                  <Label htmlFor="assignee">ผู้รับผิดชอบ</Label>
                  <Select
                    value={editedTask?.assigneeId?.toString()}
                    onValueChange={(value) => {
                      const member = assignees.find(
                        (m) => m.id === Number(value)
                      );
                      if (member) {
                        setEditedTask({
                          ...editedTask!,
                          assigneeId: member.id,
                          assigneeName: member.name,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id.toString()}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {member.id === user!.id ? "Me" : member.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {!!editedTask?.id && (
          <div className="space-y-4 h-full flex-1 flex flex-col">
            <Card className="h-full flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>ความคิดเห็น</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 h-full flex-1 flex flex-col justify-between">
                <div className="overflow-y-auto space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {comment.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {comment.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createAt, "dd/MM/yyyy HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Separator />

                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="เพิ่มความคิดเห็น..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddComment}>
                      {submitCommentLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <TaskDialogButton
        onOpenChange={onOpenChange}
        handelSubmitEditTask={handelSubmitEditTask}
        submitLoading={submitLoading}
      />
    </>
  );
}
