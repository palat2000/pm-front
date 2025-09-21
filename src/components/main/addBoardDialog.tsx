import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useStore } from "zustand";
import { projectStore } from "@/stores/project-store";
import { Loader2 } from "lucide-react";

export default function AddBoardDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const setProjectSelected = useStore(projectStore, (s) => s.selectProject);
  const handleAddBoard = async () => {
    if (!projectSelected || !name) return;
    try {
      setIsLoading(true);
      const response = await axios.post(`/boards/${projectSelected.id}`, {
        name,
      });
      setProjectSelected({
        ...projectSelected,
        boards: [...projectSelected.boards, response.data],
      });
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มบอร์ด</DialogTitle>
          <DialogDescription>เพิ่มบอร์ดใหม่</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อบอร์ด</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
            <Button className="cursor-pointer" onClick={handleAddBoard}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "เพิ่มบอร์ด"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
