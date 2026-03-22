import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useAppDispatch } from "@/redux/hooks/hooks";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/redux/auth/authThunks";
import { getErrorMessage } from "@/utils/error";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await dispatch(
        loginUser({ email: data.email, password: data.password }),
      ).unwrap();

      toast.info("Signed in sucessfully", {
        duration: 2000,
      });
      navigate("/dashboard");
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold lg:text-2xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Please log in to continue.
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
                autoComplete="current-password"
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
        </div>

        <div className="relative mt-4">
          <Button type="submit" variant="secondary" className="w-full">
            {isLoading ? (
              <>
                <Spinner /> Loading
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 px-8 text-center text-xs text-muted-foreground">
        <p>
          Forgot your password?{" "}
          <Link
            to="/forgot-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Reset Your Password
          </Link>
        </p>
        <Separator />
        <p>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
