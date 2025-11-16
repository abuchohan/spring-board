import { authSelectors } from '@/redux/auth/selectors'
import { Navigate, Outlet } from 'react-router'
import { useAppSelector } from '@/redux/hooks/hooks'
import { Spinner } from '../ui/spinner'
import { motion, AnimatePresence } from 'framer-motion'

const ProtectedRoute = () => {
    const { isAuthenticated, status } = useAppSelector(authSelectors.slice)

    // block the page whilst checking the auth
    if (status == 'checking' || status == 'idle') {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="size-8" />
            </div>
        )
    }

    return !isAuthenticated ? (
        <Navigate to="/login" replace />
    ) : (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
                <Outlet />
            </motion.div>
        </AnimatePresence>
    )
}

export default ProtectedRoute
