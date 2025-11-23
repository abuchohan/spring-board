import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { registerUser } from '@/redux/auth/authThunks'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { useNavigate } from 'react-router-dom'
import LoginWrapper from '@/components/LoginWrapper/LoginWrapper'

const registerSchema = z
    .object({
        email: z.email(),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)

        try {
            await dispatch(
                registerUser({ email: data.email, password: data.password })
            ).unwrap()

            toast.info('Registration Sucessful. Please login to continue', {
                dismissible: true,
                closeButton: true,
                duration: Infinity,
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

    return (
        <LoginWrapper>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Register</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
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
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </Field>

                        <Field className="flex flex-row gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                type="button"
                                onClick={() => navigate('/login')}
                            >
                                Go Back
                            </Button>
                            <Button
                                className="flex-1"
                                type="submit"
                                disabled={isLoading}
                            >
                                {!isLoading ? 'Register' : 'Loading'}
                                {isLoading && <Spinner />}
                            </Button>
                        </Field>

                        <FieldDescription className="text-center">
                            Already have an account?{' '}
                            <Button
                                variant="link"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                        </FieldDescription>
                    </FieldGroup>
                </form>
            </CardContent>
        </LoginWrapper>
    )
}

export default RegisterPage
