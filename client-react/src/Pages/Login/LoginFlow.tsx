import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { useNavigate } from 'react-router'
import { loginUser } from '@/redux/auth/authThunks'
import type { AuthFlow } from './LoginPage'
import { getErrorMessage } from '@/utils/error'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, { message: 'Please enter a password' }),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginFlow = ({ setFlow }: { setFlow: (flow: AuthFlow) => void }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
                duration: Infinity,
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
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    Welcome
                </CardTitle>
                <CardDescription className="text-center">
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>
            <div className="h-4" />

            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                    </div>

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isLoading}
                    >
                        {!isLoading ? 'Sign in' : 'Loading'}
                        {isLoading && <Spinner />}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
                <Separator />

                <p className="text-sm text-center text-muted-foreground">
                    <button
                        type="button"
                        onClick={() => setFlow('choosing')}
                        className="text-primary hover:underline hover:cursor-pointer"
                    >
                        Back to Login
                    </button>
                </p>
            </CardFooter>
        </>
    )
}

export default LoginFlow
