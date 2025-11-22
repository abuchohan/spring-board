import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useNavigate, useParams } from 'react-router-dom'
import { GalleryVerticalEnd, Eye, EyeOff } from 'lucide-react'
import { ResetPasswordToken, validateResetToken } from '@/redux/auth/authThunks'

const resetPasswordWithTokenSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type ResetPasswordWithTokenFormData = z.infer<
    typeof resetPasswordWithTokenSchema
>

const ResetPasswordWithToken = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { resetToken } = useParams()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordWithTokenFormData>({
        resolver: zodResolver(resetPasswordWithTokenSchema),
    })

    useEffect(() => {
        setIsTokenChecked(false)
        if (resetToken) {
            dispatch(validateResetToken(resetToken))
                .unwrap()
                .catch(() => {
                    toast.error('Invalid or expired reset token', {
                        description: 'Please request a new password reset link',
                    })
                    navigate('/login')
                })
                .finally(() => {
                    setIsTokenChecked(true)
                })
        }
    }, [])

    const onSubmit = async (data: ResetPasswordWithTokenFormData) => {
        setIsLoading(true)

        try {
            await dispatch(
                ResetPasswordToken({
                    resetToken: resetToken,
                    password: data.password,
                })
            ).unwrap()

            toast.success('Password reset successfully', {
                description: 'You can now login with your new password',
                duration: 5000,
            })
            navigate('/login')
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) || 'Something went wrong', {
                dismissible: true,
                closeButton: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return isTokenChecked ? (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Spring Board
                </div>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">
                            Reset Password
                        </CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        New Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            {...register('password')}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'}
                                            </span>
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="confirmPassword">
                                        Confirm Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            {...register('confirmPassword')}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword
                                                    ? 'Hide password'
                                                    : 'Show password'}
                                            </span>
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </Field>

                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {!isLoading
                                        ? 'Reset Password'
                                        : 'Resetting'}
                                    {isLoading && <Spinner />}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    ) : (
        <Spinner />
    )
}

export default ResetPasswordWithToken
