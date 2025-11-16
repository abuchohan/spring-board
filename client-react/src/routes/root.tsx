import { createBrowserRouter, Link } from 'react-router-dom'
import App from '@/App'
import LoginPage from '@/Pages/Login/LoginPage'
import Dashboard from '@/Pages/Dashboard/Dashboard'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute/PublicRoute'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <>
                        <h1>Marketing Page</h1> <Link to="/login">Login</Link>
                    </>
                ),
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/login',
                        element: <LoginPage />,
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
                                element: <h1>Users Page</h1>,
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
