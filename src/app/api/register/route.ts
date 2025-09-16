import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password, confirmPassword } = await req.json();
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API_URL}/users/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, confirmPassword }),
  });

  if (!response.ok) {
    return NextResponse.error();
  }

  const { token } = await response.json();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return NextResponse.json({ message: "Ok" });
}
