// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../../services/auth.api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await AuthAPI.forgotPassword({ identifier });

      setSuccess(
        "Si el correo o usuario existe en el sistema, se enviaron instrucciones para restablecer tu contraseña."
      );
      setIdentifier("");

      // Después de un pequeño tiempo, mandamos a la pantalla
      // donde el usuario escribirá el código y la nueva contraseña.
      setTimeout(() => {
        navigate("/reset-password");
      }, 1500); // puedes subir o bajar este tiempo en milisegundos
    } catch (err) {
      console.error(err);

      let msg = err.message || "Error al solicitar el cambio de contraseña";
      const lower = msg.toLowerCase();

      if (lower.includes("not found") || lower.includes("no existe")) {
        msg =
          "No encontramos una cuenta con esos datos. Verifica tu usuario o correo.";
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay" />

      <div className="auth-card-wrapper">
        <div className="auth-card card shadow-lg border-0">
          <div className="card-body p-4 p-md-5">
            <div className="auth-avatar mx-auto mb-3">
              <span>YT</span>
            </div>

            <h1 className="auth-title text-center mb-1">
              Recover your password
            </h1>
            <p className="auth-subtitle text-center mb-4">
              Escribe tu nombre de usuario o correo electrónico para enviarte un
              enlace de recuperación.
            </p>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <label className="form-label auth-label">
                  Username o Email
                </label>
                <input
                  type="text"
                  className="form-control auth-input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="ej. Yaellopez2 o correo@dominio.com"
                />
              </div>

              <button
                type="submit"
                className="btn auth-btn w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Sending..." : "Enviar instrucciones"}
              </button>

              <div className="d-flex justify-content-between small auth-links">
                <Link to="/login" className="auth-link">
                  Volver al login
                </Link>
                <Link to="/register" className="auth-link">
                  Crear cuenta
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
