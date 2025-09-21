"use client";
import { useStore } from "zustand";
import { userStore } from "@/stores/user-store";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { Loader2 } from "lucide-react";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useStore(userStore, (s) => s.setUser);
  const user = useStore(userStore, (s) => s.user);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return children;
}
