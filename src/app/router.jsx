// src/app/router.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";

// Páginas de Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Dashboard y otras páginas
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/misc/NotFoundPage";
import VideosFavoritos from "../pages/videosFavoritos/VideosFavoritos";

// Ruta protegida
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Rutas protegidas con layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal */}
        <Route index element={<DashboardPage />} />

        {/* Página de videos favoritos */}
        <Route path="favoritos" element={<VideosFavoritos />} />
        {/* Esto responde a:  https://tusitio.com/favoritos */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
