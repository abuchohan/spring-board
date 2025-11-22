import { useState } from 'react'

import { AnimatePresence, motion, easeInOut } from 'framer-motion'
import RegisterFlow from './RegisterFlow'
import LoginFlow from './LoginFlow'
import ChoosingFlow from './ChoosingFlow'
import ResetPasswordFlow from './ResetPassword'
import { FieldDescription } from '@/components/ui/field'

import { GalleryVerticalEnd } from 'lucide-react'
import { Card } from '@/components/ui/card'
export type AuthFlow = 'choosing' | 'login' | 'register' | 'reset-password'

const motionAnimation = {
    initial: {
        opacity: 0,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
    },
    exit: {
        opacity: 0,
        scale: 0.98,
    },
    transition: {
        duration: 0.2,
        ease: easeInOut,
        delay: 0.02,
    },
}

const LoginPage = () => {
    const [flow, setFlow] = useState<AuthFlow>('choosing')

    return (
        <>
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <div className="flex items-center gap-2 self-center font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Spring Board
                    </div>
                    <Card>
                        <AnimatePresence mode="wait">
                            {flow === 'choosing' && (
                                <motion.div key="choosing" {...motionAnimation}>
                                    <ChoosingFlow setFlow={setFlow} />
                                </motion.div>
                            )}

                            {flow === 'login' && (
                                <motion.div key="login" {...motionAnimation}>
                                    <LoginFlow setFlow={setFlow} />
                                </motion.div>
                            )}

                            {flow === 'register' && (
                                <motion.div key="register" {...motionAnimation}>
                                    <RegisterFlow setFlow={setFlow} />
                                </motion.div>
                            )}

                            {flow === 'reset-password' && (
                                <motion.div
                                    key="reset-password"
                                    {...motionAnimation}
                                >
                                    <ResetPasswordFlow setFlow={setFlow} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our{' '}
                        <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </>
    )
}

export default LoginPage
