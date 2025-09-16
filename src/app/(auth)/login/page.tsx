"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import axios from "axios";

const loginSchema = z.object({
  username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
  password: z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
});

const registerSchema = loginSchema
  .extend({
    username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    confirmPassword: z.string().min(4, "ยืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Page() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm | RegisterForm>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    mode: "onChange",
  });

  const isRegisterForm = (
    data: LoginForm | RegisterForm
  ): data is RegisterForm => {
    return "confirmPassword" in data;
  };

  const onSubmit = async (data: LoginForm | RegisterForm) => {
    try {
      setIsLoading(true);
      setFormError("");

      if (isRegister && isRegisterForm(data)) {
        await axios.post("/api/register", data);
        router.push("/");
      } else {
        await axios.post("/api/login", data);
        router.push("/");
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setFormError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } else if (error.response?.status === 400) {
          setFormError(error.response?.data);
        } else {
          setFormError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        console.log(error);
        setFormError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onToggleRegister = () => {
    reset();
    setFormError("");
    setIsRegister(!isRegister);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">
            {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isRegister
              ? "กรอกข้อมูลเพื่อสมัครสมาชิก"
              : "กรุณาเข้าสู่ระบบเพื่อใช้งาน"}
          </p>
        </CardHeader>
        <CardContent>
          {formError && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                className={cn({
                  "border-destructive focus-visible:ring-destructive/50":
                    errors.username,
                })}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={cn({
                  "border-destructive focus-visible:ring-destructive/50":
                    errors.password,
                })}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword" as const)}
                  className={cn({
                    "border-destructive focus-visible:ring-destructive/50":
                      "confirmPassword" in errors && errors.confirmPassword,
                  })}
                  disabled={isLoading}
                />
                {"confirmPassword" in errors && errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? "กำลังสมัครสมาชิก..." : "กำลังเข้าสู่ระบบ..."}
                </>
              ) : (
                <>{isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Button
              variant="link"
              onClick={onToggleRegister}
              className="h-auto p-0 text-foreground/70 hover:text-foreground cursor-pointer"
              type="button"
              disabled={isLoading}
            >
              {isRegister ? (
                <span className="font-medium text-primary">
                  มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
                </span>
              ) : (
                <span className="font-medium text-primary">
                  ยังไม่มีบัญชี? สมัครสมาชิก
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
