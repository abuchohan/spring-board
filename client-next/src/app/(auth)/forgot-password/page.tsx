"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { resetPasswordApi } from "@/lib/api";
import { getErrorMessage } from "@/utils/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Please enter a valid email address" })),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsPending(true);
    try {
      await resetPasswordApi(data.email);
      toast.success("Reset link sent", {
        description: "Check your email for instructions to reset your password.",
        duration: 5000,
      });
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err), { duration: 6000, closeButton: true });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold lg:text-2xl">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="email" className="sr-only">Email</label>
            <Input id="email" type="email" autoComplete="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="relative mt-4">
          <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
            {isPending ? <><Spinner /> Sending</> : "Send Reset Link"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 px-8 text-center text-xs text-muted-foreground">
        <p>
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
