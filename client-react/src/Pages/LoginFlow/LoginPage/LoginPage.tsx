import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { useAppDispatch } from '@/redux/hooks/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '@/redux/auth/authThunks'
import { getErrorMessage } from '@/utils/error'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import LoginWrapper from '@/components/LoginWrapper/LoginWrapper'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, { message: 'Please enter a password' }),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            await dispatch(
                loginUser({ email: data.email, password: data.password })
            ).unwrap()

            toast.info('Signed in sucessfully', {
                duration: 2000,
            })
            navigate('/dashboard')
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) || 'Something went wrong', {
                duration: 6000,
                closeButton: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    return (
        <LoginWrapper>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                    Please enter your login details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Enter your password"
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
                            <Link
                                to="/forgot-password"
                                className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer text-right"
                            >
                                Forgot your password?
                            </Link>
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </Field>
                        <Field className="flex flex-row gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                type="button"
                                onClick={() => navigate('/sign-in-options')}
                            >
                                Go Back
                            </Button>
                            <Button type="submit" className="flex-1">
                                {isLoading && <Spinner />}{' '}
                                {!isLoading ? 'Sign in' : 'Loading'}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </LoginWrapper>
    )
}

export default LoginPage
