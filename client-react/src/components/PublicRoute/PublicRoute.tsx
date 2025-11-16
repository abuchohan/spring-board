import { authSelectors } from '@/redux/auth/selectors'
import { useAppSelector } from '@/redux/hooks/hooks'
import { Navigate, Outlet } from 'react-router'
import { Spinner } from '../ui/spinner'
import { AnimatePresence, motion } from 'framer-motion'

const PublicRoute = () => {
    const { isAuthenticated, status } = useAppSelector(authSelectors.slice)

    // block public pages to see if the user is at the login pages
    if (status === 'idle' || status == 'checking') {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="size-8" />
            </div>
        )
    }

    return isAuthenticated ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <Outlet />
            </motion.div>
        </AnimatePresence>
    )
}

export default PublicRoute
