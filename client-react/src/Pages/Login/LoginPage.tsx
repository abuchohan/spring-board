import { useState } from 'react'

import { AnimatePresence, motion, easeInOut } from 'framer-motion'
import RegisterFlow from './RegisterFlow'
import LoginFlow from './LoginFlow'
import ChoosingFlow from './ChoosingFlow'

export type AuthFlow = 'choosing' | 'login' | 'register'

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
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="w-[288px]">
                    <AnimatePresence mode="wait">
                        {flow === 'choosing' && (
                            <motion.div key="choosing" {...motionAnimation}>
                                <ChoosingFlow setFlow={setFlow} />
                            </motion.div>
                        )}

                        {flow == 'login' && (
                            <motion.div key="login" {...motionAnimation}>
                                <LoginFlow setFlow={setFlow} />
                            </motion.div>
                        )}

                        {flow == 'register' && (
                            <motion.div key="register" {...motionAnimation}>
                                <RegisterFlow setFlow={setFlow} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

export default LoginPage
