import { createStore } from "zustand";
import { Crown, User } from "lucide-react";
import { ProjectRole } from "@/enums/role";

export const roleLabels: Map<number, string> = new Map([
  [ProjectRole.OWNER, "เจ้าของ"],
  [ProjectRole.MEMBER, "สมาชิก"],
]);

export const roleIcons: Map<number, any> = new Map([
  [ProjectRole.OWNER, Crown],
  [ProjectRole.MEMBER, User],
]);

export const roleColors: Map<number, string> = new Map([
  [ProjectRole.OWNER, "bg-yellow-100 text-yellow-800"],
  [ProjectRole.MEMBER, "bg-gray-100 text-gray-800"],
]);

export type ProjectMember = {
  id: number;
  userId: number;
  role: ProjectRole;
  name: string;
  createAt: Date;
};

export type Comment = {
  id: number;
  name: string;
  content: string;
  createAt: Date;
  updateAt: Date;
  updateBy: string;
  taskId: number;
};

export type TaskCard = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  assigneeId: number | null;
  assigneeName: string | null;
  columnId: number | null;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  assigneeId: number | null;
  assigneeName?: string;
  columnId: number | null;
  createBy: number | null;
  createAt: Date | null;
  updateBy: number | null;
  updateAt: Date | null;
  comments?: Comment[];
};

export type Column = {
  id: number;
  boardId: number;
  name: string;
  position: number;
  tasks?: TaskCard[];
};

export type Board = {
  id: number;
  projectId: number;
  name: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  color: string;
  members: ProjectMember[];
  boards: Board[];
};

export type ProjectSelected = Project & {
  userRole: ProjectRole;
};

export type ProjectState = {
  projectSelected: ProjectSelected | null;
  boards: Board[];
  boardSelected: Board | null;
  boardSelectedColumns: Column[];
};

export type ProjectActions = {
  selectProject: (project: ProjectSelected) => void;
  selectBoard: (board: Board | null) => void;
  setSelectedBoardColumns: (columns: Column[]) => void;
  setBoards: (boards: Board[]) => void;
  addMember: (member: ProjectMember) => void;
  removeMember: (member: ProjectMember) => void;
};

export type ProjectStore = ProjectState & ProjectActions;

export const projectStore = createStore<ProjectStore>()((set) => ({
  projectSelected: null,
  boards: [],
  boardSelected: null,
  boardSelectedColumns: [],
  selectProject: (project: ProjectSelected) =>
    set(() => ({ projectSelected: { ...project } })),
  selectBoard: (board: Board | null) =>
    set(() => ({ boardSelected: board ? { ...board } : null })),
  setSelectedBoardColumns: (columns: Column[]) =>
    set(() => ({ boardSelectedColumns: columns })),
  setBoards: (boards: Board[]) => set(() => ({ boards: boards })),
  addMember: (member: ProjectMember) =>
    set((state) => ({
      projectSelected: {
        ...state.projectSelected!,
        members: [...state.projectSelected!.members, member],
      },
    })),
  removeMember: (member: ProjectMember) =>
    set((state) => ({
      projectSelected: {
        ...state.projectSelected!,
        members: state.projectSelected!.members.filter(
          (m) => m.userId !== member.userId
        ),
      },
    })),
}));
