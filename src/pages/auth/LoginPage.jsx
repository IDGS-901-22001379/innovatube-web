import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthAPI } from "../../services/auth.api";
import { sessionStore } from "../../services/http";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaToken) {
      setError("Por favor completa el reCAPTCHA antes de iniciar sesión.");
      setLoading(false);
      return;
    }

    try {
      const data = await AuthAPI.login(form);
      sessionStore.set(data);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);

      let msg = err.message || "Error al iniciar sesión";

      const lower = msg.toLowerCase();
      if (
        lower.includes("invalid") &&
        (lower.includes("credentials") ||
          lower.includes("username") ||
          lower.includes("password"))
      ) {
        msg = "Usuario o contraseña incorrectos.";
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
            {/* Avatar */}
            <div className="auth-avatar mx-auto mb-3">
              <span>YT</span>
            </div>

            <h1 className="auth-title text-center mb-1">Sign in here</h1>
            <p className="auth-subtitle text-center mb-4">
              Accede a InnovaTube para buscar y guardar tus videos favoritos.
            </p>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <label className="form-label auth-label">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="identifier"
                  className="form-control auth-input"
                  value={form.identifier}
                  onChange={handleChange}
                  required
                  autoFocus
                  placeholder="ej. yael.dev o correo@dominio.com"
                />
              </div>

              <div className="mb-2">
                <label className="form-label auth-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control auth-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              {/* reCAPTCHA obligatorio para iniciar sesión */}
              <div className="mb-3 text-center auth-recaptcha-wrapper">
                {siteKey ? (
                  <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={handleCaptchaChange}
                    theme="dark"
                  />
                ) : (
                  <small className="text-danger">
                    Falta configurar VITE_RECAPTCHA_SITE_KEY.
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn auth-btn w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="d-flex justify-content-between small auth-links">
                <Link to="/forgot-password" className="auth-link">
                  Forget Password
                </Link>
                <Link to="/register" className="auth-link">
                  Sign-Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
