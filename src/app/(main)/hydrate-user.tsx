"use client";
import { useStore } from "zustand";
import { userStore } from "@/stores/user-store";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export default function HydrateUser() {
  const setUser = useStore(userStore, (s) => s.setUser);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/users/me");
        setUser({ ...response.data });
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            Cookie.remove("token");
            router.push("/login");
          }
        }
      }
    };
    fetchUser();
  }, []);

  return null;
}
