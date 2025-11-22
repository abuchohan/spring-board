import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { ResetPassword } from '@/redux/auth/authThunks'
import type { AuthFlow } from './LoginPage'
import { getErrorMessage } from '@/utils/error'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'

const resetPasswordSchema = z.object({
    email: z.email({ message: 'Please enter a valid email address' }),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPasswordFlow = ({
    setFlow,
}: {
    setFlow: (flow: AuthFlow) => void
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true)

        try {
            await dispatch(ResetPassword({ email: data.email })).unwrap()

            toast.success('Reset link sent', {
                description:
                    'Check your email for instructions to reset your password.',
                duration: 5000,
            })
            setFlow('login')
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
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    return (
        <>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password
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
                        <Field className="flex flex-row gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                type="button"
                                onClick={() => setFlow('login')}
                            >
                                Back to Login
                            </Button>
                            <Button type="submit" className="flex-1 relative">
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Spinner /> Sending
                                    </span>
                                ) : (
                                    'Send Link'
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </>
    )
}

export default ResetPasswordFlow
