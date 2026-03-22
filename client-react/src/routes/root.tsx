import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute/PublicRoute";
import LandingPage from "@/Pages/LandingPage/LandingPage";
import RegisterPage from "@/Pages/LoginFlow/RegisterPage/RegisterPage";
import ResetPasswordPage from "@/Pages/LoginFlow/ResetPasswordPage/ResetPasswordPage";

import LoginPage from "@/Pages/LoginFlow/LoginPage/LoginPage";
import ResetPasswordTokenPage from "@/Pages/LoginFlow/ResetPasswordTokenPage/ResetPasswordTokenPage";
import DashboardPage from "@/Pages/Dashboard/DashboardPage";
import ProfilePage from "@/Pages/Profile/ProfilePage";
import NotFound from "@/Pages/NotFound/NotFound";
import LoginLayout from "@/layouts/LoginLayout";

export const router = createBrowserRouter([
  {
    path: "/",
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
            element: <LoginLayout />,
            children: [
              {
                path: "/login",
                element: <LoginPage />,
              },
              {
                path: "/register",
                element: <RegisterPage />,
              },
              {
                path: "/forgot-password",
                element: <ResetPasswordPage />,
              },
              {
                path: "/reset-password/:resetToken",
                element: <ResetPasswordTokenPage />,
              },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
