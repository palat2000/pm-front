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

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  assigneeId: number | null;
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
  tasks?: Task[];
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
};

export type ProjectActions = {
  selectProject: (project: Project) => void;
};

export type ProjectStore = ProjectState & ProjectActions;

export const projectStore = createStore<ProjectStore>()((set) => ({
  projectSelected: null,
  selectProject: (project: Project) =>
    set(() => ({ projectSelected: { ...project } })),
}));
