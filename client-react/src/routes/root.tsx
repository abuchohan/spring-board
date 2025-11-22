import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import LoginPage from '@/Pages/Login/LoginPage'
import Dashboard from '@/Pages/Dashboard/Dashboard'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute/PublicRoute'
import LandingPage from '@/Pages/LandingPage/LandingPage'
import Users from '@/Pages/UsersPage/Users'

import ResetPasswordWithToken from '@/Pages/Login/ResetPasswordWithToken'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/login',
                        element: <LoginPage />,
                    },
                    {
                        path: '/reset-password/:resetToken',
                        element: <ResetPasswordWithToken />,
                    },
                ],
            },

            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Dashboard />,
                        children: [
                            {
                                index: true,
                                element: <h1>Welcome to your Dashboard</h1>,
                            },
                            {
                                path: 'users',
                                element: <Users />,
                            },
                            {
                                path: 'profile',
                                element: <h1>Profile Page</h1>,
                            },
                        ],
                    },
                ],
            },
        ],
    },
])
