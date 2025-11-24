// src/components/layout/Layout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthAPI } from "../../services/auth.api";
import { sessionStore } from "../../services/http";

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

  // === Items del menú, con iconos tipo ejemplo ===
  const navItems = [
    {
      key: "dashboard",
      to: "/",
      label: "Dashboard",
      icon: "bi bi-house-door", // icono Home
      type: "link",
    },
    {
      key: "lists",
      label: "Mis listas",
      icon: "bi bi-grid-3x3-gap", // icono tipo grid
      type: "button",
    },
    {
      key: "folder",
      label: "Biblioteca",
      icon: "bi bi-folder2-open", // icono folder
      type: "button",
    },
    {
      key: "tasks",
      label: "Tareas",
      icon: "bi bi-check2-square", // icono checklist
      type: "button",
    },
    {
      key: "calendar",
      label: "Calendario",
      icon: "bi bi-calendar3", // icono calendario
      type: "button",
    },
  ];

  // Render genérico de cada item
  const renderNavItem = (item) => {
    const showText = sidebarOpen; // sólo mostramos texto cuando está abierto

    const content = (
      <>
        <i className={item.icon + " me-lg-2"} />
        {showText && (
          <span className="it-sidebar-text d-none d-lg-inline">
            {item.label}
          </span>
        )}
      </>
    );

    if (item.type === "link") {
      return (
        <NavLink
          key={item.key}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            "it-sidebar-link" + (isActive ? " active" : "")
          }
        >
          {content}
        </NavLink>
      );
    }

    // botones “dummy” por ahora
    return (
      <button
        key={item.key}
        type="button"
        className="it-sidebar-link"
        onClick={() => {
          /* luego puedes abrir modales o rutas */
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="it-app d-flex">
      {/* Sidebar */}
      <aside className={sidebarClass}>
        {/* Logo / título */}
        <div className="it-sidebar-header d-flex align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div className="it-logo me-2">
              <div className="it-logo-youtube" />
            </div>
            {sidebarOpen && (
              <span className="it-sidebar-title fw-bold d-none d-lg-inline">
                InnovaTube
              </span>
            )}
          </div>

          {/* botón para colapsar (sólo desktop) */}
          <button
            type="button"
            className="btn btn-sm btn-outline-light ms-auto d-none d-lg-inline-flex"
            onClick={handleToggleSidebar}
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
            {sidebarOpen && (
              <span className="d-none d-lg-inline">Cerrar sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Backdrop móvil */}
      <div
        className={
          "it-sidebar-backdrop d-lg-none " + (sidebarOpen ? "show" : "")
        }
        onClick={sidebarOpen ? handleToggleSidebar : undefined}
      />

      {/* Contenedor principal */}
      <div className="it-main flex-grow-1 d-flex flex-column">
        <header className="it-topbar d-flex align-items-center px-3 px-lg-4">
          <div className="d-flex align-items-center gap-2">
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

        <main className="it-main-content flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
