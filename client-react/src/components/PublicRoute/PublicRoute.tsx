import { authSelectors } from '@/redux/auth/selectors'
import { useAppSelector } from '@/redux/hooks/hooks'
import { Navigate, Outlet } from 'react-router'
import { Spinner } from '../ui/spinner'

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

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute
