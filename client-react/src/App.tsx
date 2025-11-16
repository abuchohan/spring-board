import { useEffect } from 'react'
import { fetchSession } from './redux/auth/authThunks'
import { useAppDispatch } from './redux/hooks/hooks'
import { Outlet } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from './components/ui/sonner'

function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchSession())
    }, [dispatch])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
                <Toaster position="top-center" />
                <Outlet />
            </motion.div>
        </AnimatePresence>
    )
}

export default App
