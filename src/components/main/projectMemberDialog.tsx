"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import InviteMemberDialog from "@/components/main/inviteMemberDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import {
  ProjectMember,
  ProjectSelected,
  projectStore,
  roleColors,
  roleIcons,
  roleLabels,
} from "@/stores/project-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectRole } from "@/enums/role";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check, OctagonAlert, Trash2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useStore } from "zustand";

export default function ProjectMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const addMember = useStore(projectStore, (s) => s.addMember);
  const removeMember = useStore(projectStore, (s) => s.removeMember);
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const handleError = (err: unknown) => {
    console.log(err);
    if (err instanceof AxiosError) {
      toast.error("เกิดข้อผิดพลาด", {
        description: err.response?.data.error || err.response?.data,
      });
    } else {
      toast.error("เกิดข้อผิดพลาด", {
        description: "เกิดข้อผิดพลาด",
      });
    }
  };
  const handleInviteMember = async (inviteForm: {
    username: string;
    role: ProjectRole;
    projectId: number;
  }) => {
    try {
      const res = await axios.post("projects/add-user", inviteForm);
      toast.success("เพิ่มสมาชิกใหม่เรียบร้อย", {
        description: `เพิ่มสมาชิกใหม่ ${res.data.name} เรียบร้อย`,
      });
      const newMember: ProjectMember = {
        id: res.data.id,
        userId: res.data.userId,
        role: res.data.role,
        name: res.data.name,
        createAt: res.data.createAt,
      };
      addMember(newMember);
      setIsInviteModalOpen(false);
    } catch (err) {
      handleError(err);
    }
  };
  const handleRemoveMember = async (
    projectId: number,
    member: ProjectMember
  ) => {
    try {
      await axios.post("projects/remove-user", {
        projectId,
        userId: member.userId,
      });
      removeMember(member);
      toast.success("ลบสมาชิกเรียบร้อย", {
        description: `ลบสมาชิก ${member.name} เรียบร้อย`,
      });
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>สมาชิก</DialogTitle>
              <DialogDescription>{projectSelected?.name}</DialogDescription>
            </div>
            <InviteMemberDialog
              open={isInviteModalOpen}
              onOpenChange={setIsInviteModalOpen}
              projectSelected={projectSelected}
              handleInviteMember={handleInviteMember}
            />
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              สมาชิกทั้งหมด {projectSelected?.members.length} คน
            </div>

            {projectSelected?.members.map((member) => {
              const RoleIcon = roleIcons.get(member.role);

              return (
                <Card key={member.id} className="py-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{member.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            เข้าร่วมเมื่อ{" "}
                            {formatDate(member.createAt, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`${roleColors.get(
                            member.role
                          )} flex items-center gap-1`}
                        >
                          {RoleIcon && <RoleIcon className="w-3 h-3" />}
                          {roleLabels.get(member.role)}
                        </Badge>

                        {member.role !== ProjectRole.OWNER &&
                          projectSelected.userRole === ProjectRole.OWNER && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive cursor-pointer"
                                  onClick={() =>
                                    handleRemoveMember(
                                      projectSelected!.id,
                                      member
                                    )
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-1 text-inherit" />
                                  ลบ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
