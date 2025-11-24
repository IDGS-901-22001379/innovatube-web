import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthAPI } from "../../services/auth.api";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

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
    setSuccess("");

    if (!captchaToken) {
      setError("Por favor completa el reCAPTCHA antes de registrarte.");
      setLoading(false);
      return;
    }

    try {
      await AuthAPI.register(form);

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      let msg = err.message || "Error al registrar usuario";

      const lower = msg.toLowerCase();

      // Correo duplicado
      if (
        lower.includes("duplicate entry") &&
        (lower.includes("email") || lower.includes("ux_users_email"))
      ) {
        msg =
          "Lo sentimos, pero el correo ya está registrado. Intenta iniciar sesión o usa otro correo.";
      }

      // Username duplicado
      if (
        lower.includes("duplicate entry") &&
        (lower.includes("username") || lower.includes("ux_users_username"))
      ) {
        msg =
          "El nombre de usuario ya existe. Por favor elige otro nombre de usuario.";
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

            <h1 className="auth-title text-center mb-1">Create account</h1>
            <p className="auth-subtitle text-center mb-4">
              Regístrate para comenzar a usar InnovaTube.
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
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label auth-label">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control auth-input"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label auth-label">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control auth-input"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="form-label auth-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control auth-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-2">
                <label className="form-label auth-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control auth-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-2 mb-3">
                <label className="form-label auth-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control auth-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

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
                {loading ? "Creating..." : "Sign-Up"}
              </button>

              <p
                className="text-center text-muted mb-0"
                style={{ fontSize: "0.9rem" }}
              >
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="auth-link">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
