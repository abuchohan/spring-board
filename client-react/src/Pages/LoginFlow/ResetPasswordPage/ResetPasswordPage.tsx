import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { resetPassword } from "@/redux/auth/authThunks";
import { getErrorMessage } from "@/utils/error";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Please enter a valid email address" })),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      await dispatch(resetPassword({ email: data.email })).unwrap();

      toast.success("Reset link sent", {
        description:
          "Check your email for instructions to reset your password.",
        duration: 5000,
      });
      navigate("/login");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Something went wrong", {
        duration: 6000,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold lg:text-2xl">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="relative mt-4">
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner /> Sending
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 px-8 text-center text-xs text-muted-foreground">
        <p>
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
