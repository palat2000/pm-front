import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const user = await axios.get("users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return NextResponse.redirect(new URL("/", req.url));
    } catch (err) {
      const cookieStore = await cookies();
      cookieStore.delete("token");
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login"],
};
