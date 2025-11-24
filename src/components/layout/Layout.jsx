// src/components/layout/Layout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthAPI } from "../../services/auth.api";
import { sessionStore } from "../../services/http";

// Ítems del sidebar con sus iconos
const navItems = [
  {
    key: "dashboard",
    type: "link",
    to: "/",
    label: "Dashboard",
    icon: "bi-house",
  },
  {
    key: "lists",
    type: "link",
    to: "/favoritos",
    label: "Mis listas",
    icon: "bi-grid-3x3-gap",
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const session = sessionStore.get();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const sessionId = session?.sessionId ?? 0;
    try {
      await AuthAPI.logout(sessionId);
    } catch (e) {
      console.warn("Error al cerrar sesión en backend:", e);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const titleByPath = () => {
    if (location.pathname === "/") return "Inicio";
    return "InnovaTube";
  };

  const sidebarClass = [
    "it-sidebar",
    sidebarOpen ? "it-sidebar-open" : "it-sidebar-collapsed",
  ].join(" ");

  // Render de cada ítem de navegación
  const renderNavItem = (item) => {
    const showText = sidebarOpen; // texto solo cuando el sidebar está abierto

    const iconElement = (
      <span className="me-lg-2 d-flex align-items-center justify-content-center">
        <i className={`bi ${item.icon}`} />
      </span>
    );

    if (item.type === "link") {
      return (
        <NavLink
          key={item.key}
          to={item.to}
          end
          className={({ isActive }) =>
            "it-sidebar-link" + (isActive ? " active" : "")
          }
        >
          {iconElement}
          {showText && <span className="it-sidebar-text">{item.label}</span>}
        </NavLink>
      );
    }

    return (
      <button
        key={item.key}
        type="button"
        className="it-sidebar-link"
        onClick={() => {
          console.log("Click en", item.key);
        }}
      >
        {iconElement}
        {showText && <span className="it-sidebar-text">{item.label}</span>}
      </button>
    );
  };

  return (
    <div className="it-app d-flex">
      {/* Sidebar */}
      <aside className={sidebarClass}>
        {/* Header del sidebar */}
        <div className="it-sidebar-header d-flex align-items-center mb-4">
          {/* Logo + texto SOLO en desktop y SOLO cuando está abierto */}
          {sidebarOpen && (
            <div className="d-none d-lg-flex align-items-center">
              <div className="it-logo me-2">
                <div className="it-logo-youtube" />
              </div>
              <span className="it-sidebar-title fw-bold">InnovaTube</span>
            </div>
          )}

          {/* Flecha para abrir/cerrar: visible en desktop y móvil,
              y se queda flotando cuando el sidebar está pequeño */}
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="ms-auto d-flex align-items-center justify-content-center btn btn-sm btn-outline-light rounded-circle"
            style={{ width: 40, height: 40 }}
          >
            <i
              className={
                "bi " +
                (sidebarOpen
                  ? "bi-chevron-double-left"
                  : "bi-chevron-double-right")
              }
            />
          </button>
        </div>

        {/* Navegación */}
        <nav className="it-sidebar-nav flex-grow-1">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer sidebar */}
        <div className="it-sidebar-footer mt-auto">
          {session?.username && (
            <div className="small text-white-50 mb-2 it-user-label">
              Conectado como <strong>{session.username}</strong>
            </div>
          )}

          <button
            type="button"
            className="btn btn-sm btn-outline-light w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-lg-1" />
            <span className="d-none d-lg-inline">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Backdrop en móvil: al tocar fuera del menú se cierra */}
      <div
        className={
          "it-sidebar-backdrop d-lg-none " + (sidebarOpen ? "show" : "")
        }
        onClick={sidebarOpen ? handleToggleSidebar : undefined}
      />

      {/* Contenedor principal */}
      <div className="it-main flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <header className="it-topbar d-flex align-items-center px-3 px-lg-4">
          <div className="d-flex align-items-center gap-2">
            {/* Botón hamburguesa SOLO en móvil */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-lg-none"
              onClick={handleToggleSidebar}
            >
              <i className="bi bi-list" />
            </button>
            <h1 className="it-topbar-title mb-0">{titleByPath()}</h1>
          </div>
        </header>

        {/* Contenido: tocar en móvil cierra el menú si está abierto */}
        <main
          className="it-main-content flex-grow-1"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.innerWidth < 992 &&
              sidebarOpen
            ) {
              setSidebarOpen(false);
            }
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
