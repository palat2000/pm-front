"use client";
import { Board } from "@/stores/project-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useStore } from "zustand";
import { projectStore } from "@/stores/project-store";

export default function ColumnDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const boardSelected = useStore(projectStore, (s) => s.boardSelected);
  const columns = useStore(projectStore, (s) => s.boardSelectedColumns);
  const setSelectedBoardColumns = useStore(
    projectStore,
    (s) => s.setSelectedBoardColumns
  );
  const [name, setName] = useState("");

  const handleAddColumn = async () => {
    if (!boardSelected) return;
    try {
      const nextPosition = Math.max(...columns.map((col) => col.position)) + 1;
      const response = await axios.post("/columns", {
        name,
        boardId: boardSelected.id,
        position: nextPosition,
      });
      const column = response.data;
      setSelectedBoardColumns([column, ...columns]);
      onOpenChange(false);
      setName("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-auto min-h-[20vh]">
        <DialogHeader className="pt-4">
          <DialogTitle>เพิ่มรายการใหม่</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อรายการ</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button className="cursor-pointer" onClick={handleAddColumn}>
            เพิ่ม
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
