import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute/PublicRoute'
import LandingPage from '@/Pages/LandingPage/LandingPage'
import Users from '@/Pages/UsersPage/Users'
import RegisterPage from '@/Pages/LoginFlow/RegisterPage/RegisterPage'
import ResetPasswordPage from '@/Pages/LoginFlow/ResetPasswordPage/ResetPasswordPage'

import SignInOptions from '@/Pages/LoginFlow/SignInOptions/SignInOptions'
import LoginPage from '@/Pages/LoginFlow/LoginPage/LoginPage'
import ResetPasswordTokenPage from '@/Pages/LoginFlow/ResetPasswordTokenPage/ResetPasswordTokenPage'
import DashboardPage from '@/Pages/Dashboard/DashboardPage'
import NotFound from '@/Pages/NotFound/NotFound'

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
                        path: '/sign-in-options',
                        element: <SignInOptions />,
                    },
                    {
                        path: '/login',
                        element: <LoginPage />,
                    },
                    {
                        path: '/register',
                        element: <RegisterPage />,
                    },
                    {
                        path: '/forgot-password',
                        element: <ResetPasswordPage />,
                    },
                    {
                        path: '/forgot-password/:resetToken',
                        element: <ResetPasswordTokenPage />,
                    },
                ],
            },

            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <DashboardLayout />,
                        children: [
                            {
                                index: true,
                                element: <DashboardPage />,
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
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
])
