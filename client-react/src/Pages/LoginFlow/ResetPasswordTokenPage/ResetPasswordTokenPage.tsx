import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  resetPasswordWithToken,
  validateResetToken,
} from "@/redux/auth/authThunks";

const resetPasswordWithTokenSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordWithTokenFormData = z.infer<
  typeof resetPasswordWithTokenSchema
>;

const ResetPasswordTokenPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordWithTokenFormData>({
    resolver: zodResolver(resetPasswordWithTokenSchema),
  });

  useEffect(() => {
    setIsTokenChecked(false);
    if (resetToken) {
      dispatch(validateResetToken(resetToken))
        .unwrap()
        .catch(() => {
          toast.error("Invalid or expired reset token", {
            description: "Please request a new password reset link",
          });
          navigate("/login");
        })
        .finally(() => {
          setIsTokenChecked(true);
        });
    }
  }, []);

  const onSubmit = async (data: ResetPasswordWithTokenFormData) => {
    setIsLoading(true);

    try {
      await dispatch(
        resetPasswordWithToken({ resetToken, password: data.password }),
      ).unwrap();

      toast.success("Password reset successfully", {
        description: "You can now login with your new password",
        duration: 5000,
      });
      navigate("/login");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Something went wrong", {
        dismissible: true,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenChecked) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-sm text-muted-foreground">
          Validating reset token...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold lg:text-2xl">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="New Password"
                className="pr-9"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm Password"
                className="pr-9"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
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
                <Spinner /> Resetting
              </>
            ) : (
              "Reset Password"
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

export default ResetPasswordTokenPage;
