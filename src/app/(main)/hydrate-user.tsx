"use client";
import { useStore } from "zustand";
import { userStore } from "@/stores/user-store";
import { useEffect } from "react";
import axios from "@/config/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function HydrateUser({ token }: { token: string }) {
  const setUser = useStore(userStore, (s) => s.setUser);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async (token: string) => {
      try {
        const response = await axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser({ ...response.data, token });
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
          }
        }
      }
    };
    fetchUser(token);
  }, [token]);

  return null;
}
