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
import { useAppDispatch } from '@/redux/hooks/hooks'
import { registerUser } from '@/redux/auth/authThunks'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

type LoginFormData = z.infer<typeof registerSchema>

const RegisterFlow = ({ setFlow }: { setFlow: (flow: AuthFlow) => void }) => {
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
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
            setFlow('login')
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
                            onError={() => console.log('error')}
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
            <div className="h-4" />

            <CardFooter className="flex flex-col space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                    <a
                        onClick={() => setFlow('choosing')}
                        className="text-primary hover:underline hover:cursor-pointer"
                    >
                        Back to Login
                    </a>
                </p>
            </CardFooter>
        </>
    )
}

export default RegisterFlow
