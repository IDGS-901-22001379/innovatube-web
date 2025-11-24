// src/services/http.js

// Base del backend. Se toma de .env: VITE_API_BASE_URL
// Ejemplo local: http://localhost:5064
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5064"
).replace(/\/$/, "");

// Prefijo común de tu API: /api
const API_PREFIX = "/api";

// Une dos segmentos de URL sin duplicar "/"
const join = (a, b) => `${a}${b.startsWith("/") ? "" : "/"}${b}`;

/**
 * Manejo sencillo de sesión en localStorage.
 * Clave única para InnovaTube.
 */
export const sessionStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("innovatube_session")) || null;
    } catch {
      return null;
    }
  },
  set(value) {
    localStorage.setItem("innovatube_session", JSON.stringify(value));
  },
  clear() {
    localStorage.removeItem("innovatube_session");
  },
};

/**
 * Construye la URL final con /api + ruta + query params.
 */
function buildUrl(url, params) {
  let fullUrl = join(join(API_BASE, API_PREFIX), url);

  if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
    }
  }

  return fullUrl;
}

/**
 * Cliente genérico para hacer peticiones a la API.
 * Agrega automáticamente el Bearer token si existe en sessionStore.
 */
async function request(method, url, body, options = {}) {
  const session = sessionStore.get();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Soporta accessToken / token / jwtToken, por si cambia el nombre
  const token =
    session?.accessToken || session?.token || session?.jwtToken || session?.jwt;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = buildUrl(url, options.params);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let rawText = "";
  try {
    rawText = await res.clone().text();
  } catch {
    // ignoramos si no se puede leer
  }

  if (!res.ok) {
    let msg =
      `Error ${res.status}: ` +
      (res.statusText || "Error al conectar con el servidor");

    try {
      if (rawText) {
        const data = JSON.parse(rawText);
        msg =
          data.message ||
          data.error ||
          data.title || // ProblemDetails de ASP.NET
          msg;
      }
    } catch {
      if (rawText) msg = rawText;
    }

    throw new Error(msg);
  }

  if (res.status === 204 || !rawText) return null;

  try {
    return JSON.parse(rawText);
  } catch {
    return rawText;
  }
}

export const http = {
  get: (url, options) => request("GET", url, undefined, options),
  post: (url, body, options) => request("POST", url, body, options),
  put: (url, body, options) => request("PUT", url, body, options),
  del: (url, options) => request("DELETE", url, undefined, options),
};
