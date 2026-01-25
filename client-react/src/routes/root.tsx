import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute/PublicRoute";
import LandingPage from "@/Pages/LandingPage/LandingPage";
import RegisterPage from "@/Pages/LoginFlow/RegisterPage/RegisterPage";
import ResetPasswordPage from "@/Pages/LoginFlow/ResetPasswordPage/ResetPasswordPage";

import SignInOptions from "@/Pages/LoginFlow/SignInOptions/SignInOptions";
import LoginPage from "@/Pages/LoginFlow/LoginPage/LoginPage";
import ResetPasswordTokenPage from "@/Pages/LoginFlow/ResetPasswordTokenPage/ResetPasswordTokenPage";
import NotFound from "@/Pages/NotFound/NotFound";
import VoiceTaggingPage from "@/Pages/VoiceTaggingPage/VoiceTaggingPage";
import AppLayout from "@/layouts/AppLayout";
import AppPage from "@/Pages/App/AppPage";

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
            path: "/sign-in-options",
            element: <SignInOptions />,
          },
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
            path: "/forgot-password/:resetToken",
            element: <ResetPasswordTokenPage />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/app",
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <AppPage />,
              },
              {
                path: "tasks",
                element: <VoiceTaggingPage />,
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
