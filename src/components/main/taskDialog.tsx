import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Comment, Task } from "@/stores/project-store";
import { useEffect, useState } from "react";
import axios from "@/config/axios";
import { useStore } from "zustand";
import { userStore } from "@/stores/user-store";
import { UserDdl } from "@/model/userDdl";
import TaskDialogContent from "./taskDialogContent";
import { Loader2 } from "lucide-react";

export default function TaskDialog({
  task,
  open,
  onOpenChange,
  projectId,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
}) {
  const user = useStore(userStore, (s) => s.user);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [assignees, setAssignees] = useState<UserDdl[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitCommentLoading, setSubmitCommentLoading] = useState(false);

  const createTask = async () => {
    try {
      setSubmitLoading(true);
      const res = await axios.post("tasks", editedTask, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setEditedTask({
        ...editedTask!,
        id: res.data.id,
        createAt: res.data.createAt,
        updateAt: res.data.updateAt,
        updateBy: res.data.updateBy,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateTask = async () => {
    try {
      setSubmitLoading(true);
      const res = await axios.put(`tasks/${editedTask!.id}`, editedTask, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setEditedTask({
        ...editedTask!,
        id: res.data.id,
        createAt: res.data.createAt,
        updateAt: res.data.updateAt,
        updateBy: res.data.updateBy,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handelSubmitEditTask = async () => {
    if (editedTask?.id) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitCommentLoading(true);
      const body = {
        content: newComment,
        taskId: editedTask!.id,
      };
      const res = await axios.post("comments", body, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const newCommentData: Comment = {
        id: res.data.id,
        name: res.data.name || "",
        content: res.data.content || "",
        createAt: res.data.createAt,
        updateAt: res.data.updateAt,
        updateBy: res.data.updateBy || "",
        taskId: res.data.taskId,
      };
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitCommentLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    if (task && task.id) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(`tasks/${task.id}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          setEditedTask({
            assigneeId: res.data.assigneeId,
            columnId: res.data.columnId,
            createAt: res.data.createAt,
            description: res.data.description,
            dueDate: res.data.dueDate,
            id: res.data.id,
            title: res.data.title,
            updateAt: res.data.updateAt,
            updateBy: res.data.updateBy,
            createBy: res.data.createBy,
          });
          setComments(
            res.data.comments.map((com: any) => {
              return {
                id: com.id,
                name: com.name || "",
                content: com.content || "",
                createAt: com.createAt,
                updateAt: com.updateAt,
                updateBy: com.updateBy || "",
                taskId: com.taskId,
              };
            })
          );
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    } else if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  useEffect(() => {
    if (projectId > 0) {
      const fetchAssignees = async () => {
        try {
          const res = await axios.get(`users/project-members/${projectId}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          setAssignees(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAssignees();
    }
  }, [projectId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto min-h-[80vh]">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center h-full flex-1">
              <Loader2 className="animate-spin" />
            </div>
          </>
        ) : (
          <TaskDialogContent
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            task={task}
            comments={comments}
            assignees={assignees}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            handelSubmitEditTask={handelSubmitEditTask}
            user={user}
            onOpenChange={onOpenChange}
            submitLoading={submitLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
