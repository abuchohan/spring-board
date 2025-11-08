import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import LoginPage from '@/Pages/Login/LoginPage'

export const router = createBrowserRouter([
    {
        path: '/welcome',
        element: <App />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        // element: <ProtectedRoute />, // everything inside is protected
        children: [
            {
                path: '/',
                // element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <h1>Welcome to your Dashboard</h1>,
                    },
                    {
                        path: 'settings',
                        element: <h1>Settings Page</h1>,
                    },
                    {
                        path: 'profile',
                        element: <h1>Profile Page</h1>,
                    },
                ],
            },
        ],
    },
])
