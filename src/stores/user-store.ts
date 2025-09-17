import { createStore } from "zustand";

export type User = {
  id: number;
  username: string;
  name: string;
};

export type UserState = {
  user: User | null;
};

export type UserActions = {
  setUser: (user: User) => void;
};

export type UserStore = UserState & UserActions;

export const userStore = createStore<UserStore>()((set) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user: { ...user } })),
}));
