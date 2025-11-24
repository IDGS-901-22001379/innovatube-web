import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../../services/auth.api";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await AuthAPI.resetPassword({ code, newPassword });

      setSuccess("Tu contraseña se ha actualizado correctamente.");
      setTimeout(() => {
        navigate("/login");
      }, 1600);
    } catch (err) {
      console.error(err);

      let msg = err.message || "Error al restablecer contraseña";

      const lower = msg.toLowerCase();
      if (lower.includes("invalid") && lower.includes("code")) {
        msg = "El código ingresado no es válido o ya expiró.";
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

            <h1 className="auth-title text-center mb-1">Reset password</h1>
            <p className="auth-subtitle text-center mb-4">
              Ingresa el código que recibiste y tu nueva contraseña.
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
                <label className="form-label auth-label">Código</label>
                <input
                  type="text"
                  className="form-control auth-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Código de recuperación"
                />
              </div>

              <div className="mb-3">
                <label className="form-label auth-label">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-3">
                <label className="form-label auth-label">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repite la contraseña"
                />
              </div>

              <button
                type="submit"
                className="btn auth-btn w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Updating..." : "Actualizar contraseña"}
              </button>

              <div className="d-flex justify-content-between small auth-links">
                <Link to="/login" className="auth-link">
                  Ir al login
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
