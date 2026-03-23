import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { registerUser } from "@/redux/auth/authThunks";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await dispatch(
        registerUser({ email: data.email, password: data.password }),
      ).unwrap();

      toast.info("Registration successful. Please login to continue", {
        dismissible: true,
        closeButton: true,
        duration: Infinity,
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

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold lg:text-2xl">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started.
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

          <div className="grid gap-1">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Password"
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
                <Spinner /> Loading
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 px-8 text-center text-xs text-muted-foreground">
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
