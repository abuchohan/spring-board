import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { AuthFlow } from './LoginPage'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { registerUser } from '@/redux/auth/authThunks'
import { Alert } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

type LoginFormData = z.infer<typeof registerSchema>

const RegisterFlow = ({ setFlow }: { setFlow: (flow: AuthFlow) => void }) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setServerError(null)

        const res = await dispatch(
            registerUser({ email: data.email, password: data.password })
        )
        setIsLoading(false)

        navigate('/dashboard')
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    Register
                </CardTitle>
                <CardDescription className="text-center"></CardDescription>
            </CardHeader>

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
                    </div>

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isLoading}
                    >
                        {!isLoading ? 'Register' : 'Loading'}
                        {isLoading && <Spinner />}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                    <a
                        href="#"
                        onClick={() => setFlow('choosing')}
                        className="text-primary hover:underline"
                    >
                        {' '}
                        Back to Login
                    </a>
                </p>
            </CardFooter>

            {serverError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircleIcon className="h-4 w-4" />
                    <p>{serverError}</p>
                </Alert>
            )}
        </>
    )
}

export default RegisterFlow
