// src/services/auth.api.js
import { http, sessionStore } from "./http";

/**
 * Servicio de autenticación conectado a:
 *
 * POST /api/Auth/register
 * POST /api/Auth/login
 * POST /api/Auth/refresh
 * POST /api/Auth/forgot-password
 * POST /api/Auth/reset-password
 * POST /api/Auth/logout?sessionId=...
 */
export const AuthAPI = {
  /**
   * Registro de usuario
   * {
   *   firstName: string,
   *   lastName: string,
   *   username: string,
   *   email: string,
   *   password: string
   * }
   */
  register(payload) {
    return http.post("/Auth/register", payload);
  },

  /**
   * Login
   * {
   *   identifier: string, // username o email
   *   password: string
   * }
   *
   *  Aquí guardamos la sesión en localStorage
   */
  async login(payload) {
    const data = await http.post("/Auth/login", payload);

    // Tomamos el token y datos importantes de la respuesta
    const session = {
      accessToken:
        data.accessToken ||
        data.token ||
        data.jwtToken ||
        data.jwt ||
        data.bearerToken,
      refreshToken: data.refreshToken ?? null,
      sessionId: data.sessionId ?? data.id ?? null,
      username: data.username ?? data.userName ?? null,
      email: data.email ?? null,
    };

    // Guardar en localStorage (clave innovatube_session)
    sessionStore.set(session);

    // Seguimos regresando la respuesta original por si la usas en el LoginPage
    return data;
  },

  /**
   * Refresh token
   * {
   *   refreshToken: string
   * }
   */
  async refreshToken(payload) {
    const data = await http.post("/Auth/refresh", payload);

    // Si el backend responde con nuevos tokens, actualizamos la sesión
    const current = sessionStore.get() || {};
    const session = {
      ...current,
      accessToken:
        data.accessToken ||
        data.token ||
        data.jwtToken ||
        data.jwt ||
        current.accessToken,
      refreshToken: data.refreshToken ?? current.refreshToken,
    };

    sessionStore.set(session);
    return data;
  },

  /**
   * Olvidé mi contraseña
   * {
   *   identifier: string // username o email
   * }
   */
  forgotPassword(payload) {
    return http.post("/Auth/forgot-password", payload);
  },

  /**
   * Resetear contraseña
   * {
   *   code: string,
   *   newPassword: string
   * }
   */
  resetPassword(payload) {
    return http.post("/Auth/reset-password", payload);
  },

  /**
   * Logout
   *   sessionId: number (int64)
   *
   *  Llamamos al backend y, pase lo que pase, limpiamos la sesión local.
   */
  async logout(sessionId) {
    const query = `?sessionId=${encodeURIComponent(sessionId)}`;
    try {
      await http.post(`/Auth/logout${query}`);
    } finally {
      // Siempre limpiar la sesión en el frontend
      sessionStore.clear();
    }
  },
};
