"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectRole } from "@/enums/role";
import { useEffect, useState } from "react";
import { Project } from "@/stores/project-store";

export default function InviteMemberDialog({
  open,
  onOpenChange,
  projectSelected,
  handleInviteMember,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSelected: Project | null;
  handleInviteMember: ({
    username,
    role,
    projectId,
  }: {
    username: string;
    role: ProjectRole;
    projectId: number;
  }) => void;
}) {
  const [inviteForm, setInviteForm] = useState({
    username: "",
    role: ProjectRole.MEMBER,
    projectId: projectSelected?.id || 0,
  });

  useEffect(() => {
    setInviteForm({
      username: "",
      role: ProjectRole.MEMBER,
      projectId: projectSelected?.id || 0,
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4" />
          เชิญสมาชิก
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เชิญสมาชิกใหม่</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">ชื่อผู้ใช้</Label>
            <Input
              id="username"
              type="text"
              value={inviteForm.username}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, username: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">บทบาท</Label>
            <Select
              value={inviteForm.role.toString()}
              onValueChange={(value) =>
                setInviteForm({ ...inviteForm, role: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProjectRole.MEMBER.toString()}>
                  สมาชิก
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => {
                handleInviteMember(inviteForm);
              }}
            >
              เพิ่มสมาชิก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
