import { createStore } from "zustand";

export type ProjectMember = {
  id: number;
  userId: number;
  role: number;
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
  members: ProjectMember[];
  boards: Board[];
};

export type ProjectState = {
  projectSelected: Project | null;
  boards: Board[];
  boardSelected: Board | null;
  boardSelectedColumns: Column[];
};

export type ProjectActions = {
  selectProject: (project: Project) => void;
  selectBoard: (board: Board) => void;
  setSelectedBoardColumns: (columns: Column[]) => void;
  setBoards: (boards: Board[]) => void;
};

export type ProjectStore = ProjectState & ProjectActions;

export const projectStore = createStore<ProjectStore>()((set) => ({
  projectSelected: null,
  boards: [],
  boardSelected: null,
  boardSelectedColumns: [],
  selectProject: (project: Project) =>
    set(() => ({ projectSelected: { ...project } })),
  selectBoard: (board: Board) => set(() => ({ boardSelected: { ...board } })),
  setSelectedBoardColumns: (columns: Column[]) =>
    set(() => ({ boardSelectedColumns: columns })),
  setBoards: (boards: Board[]) => set(() => ({ boards: boards })),
}));
