// src/pages/dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
import { VideosApi } from "../../services/videos.api";

const CATEGORIES = [
  { label: "Todos", value: "" },

  // Deportes
  { label: "Fútbol", value: "partidos de fútbol 2025" },
  { label: "Deportes", value: "deportes resumen 2025" },

  // Tecnología y gaming
  { label: "Tecnología", value: "noticias de tecnología 2025" },
  { label: "Juegos", value: "gameplay de videojuegos 2025" },

  // Programación general
  { label: "Programación", value: "programación para principiantes" },
];

// consultas base para “videos al azar”
const RANDOM_QUERIES = [
  "música lo-fi",
  "programación y tecnología",
  "Java",
  "Juegos",
  "React",
  "Angular",
  "Platzi",
];

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [randomVideos, setRandomVideos] = useState([]);

  // solo para saber cuáles ya son favoritos
  const [favorites, setFavorites] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Al entrar: cargar feed al azar Y favoritos
  useEffect(() => {
    loadRandomVideos();
    loadFavorites();
  }, []);

  // Cargar videos al azar
  async function loadRandomVideos() {
    try {
      setError("");
      const randomTerm =
        RANDOM_QUERIES[Math.floor(Math.random() * RANDOM_QUERIES.length)];
      const controller = new AbortController();
      const data = await VideosApi.searchYoutube(randomTerm, controller.signal);
      setRandomVideos(data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar videos al azar.");
    }
  }

  // 🔹 Cargar favoritos desde el backend
  async function loadFavorites(searchText) {
    try {
      // mismo error general por simplicidad
      setError("");
      const data = await VideosApi.getFavorites(searchText);
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus videos favoritos.");
    }
  }

  // Búsqueda genérica (formulario y chips)
  async function runSearch(term) {
    const text = term.trim();
    if (!text) return;

    try {
      setLoadingSearch(true);
      setError("");
      const controller = new AbortController();
      const data = await VideosApi.searchYoutube(text, controller.signal);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al buscar videos. Intenta de nuevo.");
    } finally {
      setLoadingSearch(false);
    }
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    await runSearch(query);
  }

  // Revisa si un video YA está en la lista de favoritos cargada
  function isFavorite(videoId) {
    return favorites.some((f) => f.videoId === videoId);
  }

  // Agregar / quitar de favoritos
  async function handleToggleFavorite(video) {
    try {
      setError("");

      if (isFavorite(video.videoId)) {
        // quitar
        await VideosApi.removeFavorite(video.videoId);
        setFavorites((prev) => prev.filter((f) => f.videoId !== video.videoId));
      } else {
        // agregar
        await VideosApi.addFavorite(video);
        setFavorites((prev) => [...prev, video]);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la lista de favoritos.");
    }
  }

  // Click en chip de categoría
  async function handleCategoryClick(cat) {
    setActiveCategory(cat.label);

    if (!cat.value) {
      // "Todos": limpiar resultados y mostrar feed al azar
      setResults([]);
      await loadRandomVideos();
      return;
    }

    setQuery(cat.label);
    await runSearch(cat.value);
  }

  // Feed principal: si hay resultados de búsqueda, usamos esos;
  // si no, usamos los videos al azar.
  const feedVideos = results.length > 0 ? results : randomVideos;

  const resultsSubtitle = (() => {
    if (results.length > 0) {
      return `${results.length} resultado(s) de búsqueda`;
    }
    if (randomVideos.length > 0) {
      return "Videos al azar para ti";
    }
    return "Realiza una búsqueda o elige una categoría";
  })();

  return (
    <div className="container-fluid px-0 px-md-1">
      {/* HEADER pegado arriba (título + buscador + chips) */}
      <div
        className="sticky-top"
        style={{
          top: 0,
          zIndex: 900,
        }}
      >
        <div
          className="px-3 px-md-4 py-3"
          style={{
            background:
              "linear-gradient(90deg, #4b0081 0%, #7f00b2 40%, #150028 100%)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
          }}
        >
          {/* Título principal tipo YouTube */}
          <div className="mb-3">
            <h2
              className="fw-bold text-white mb-1"
              style={{ fontSize: "1.6rem" }}
            >
              Busca videos de YouTube
            </h2>
            <p className="text-white-50 mb-0" style={{ maxWidth: "720px" }}>
              Márcalos como favoritos y gestiona tu lista personal.
            </p>
          </div>

          {/* Alertas de error */}
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          {/* Buscador principal (input + icono lupa dentro) */}
          <div className="mb-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill ps-4 pe-5"
                  placeholder="Ej. React tutorial, música lo-fi, etc."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 p-0"
                  disabled={loadingSearch || !query.trim()}
                  style={{ color: "#4f46e5" }}
                >
                  {loadingSearch ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="bi bi-search fs-5" />
                  )}
                  <span className="visually-hidden">Buscar</span>
                </button>
              </div>
            </form>
          </div>

          {/* Chips de categorías tipo YouTube */}
          <div className="mb-1">
            <div className="d-flex flex-row flex-nowrap gap-2 overflow-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={
                    "btn btn-sm rounded-pill px-3 " +
                    (activeCategory === cat.label
                      ? "btn-light text-dark"
                      : "btn-outline-light border-0 text-light")
                  }
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor:
                      activeCategory === cat.label
                        ? "#ffffff"
                        : "rgba(0,0,0,0.18)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO principal: sólo aquí hay scroll “real” de videos */}
      <div className="row g-3 g-lg-4 mx-0 mx-md-0 mt-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2 px-3 px-md-0">
            <h5 className="mb-0 fw-semibold text-white">Videos</h5>
            <small className="text-white-50">{resultsSubtitle}</small>
          </div>

          {feedVideos.length === 0 && (
            <div className="text-white-50 fst-italic px-3 px-md-0 mb-3">
              Aún no hay resultados. Escribe algo en el buscador de arriba o
              toca una categoría.
            </div>
          )}

          {/* 3 videos por fila en pantallas medianas, 4 en pantallas grandes */}
          <div className="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-3 px-3 px-md-0">
            {feedVideos.map((video) => (
              <div key={video.videoId} className="col">
                <div className="card h-100 shadow-sm">
                  {video.thumbnailUrl && (
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={video.thumbnailUrl}
                        className="card-img-top"
                        alt={video.title}
                      />
                    </a>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-semibold">
                      {video.title.length > 80
                        ? video.title.slice(0, 80) + "..."
                        : video.title}
                    </h6>
                    <p className="card-text text-muted small mb-1">
                      {video.channelTitle}
                    </p>
                    <p className="card-text small flex-grow-1">
                      {video.description
                        ? video.description.slice(0, 120) + "..."
                        : "Sin descripción"}
                    </p>
                    <button
                      type="button"
                      className={
                        "btn mt-2 " +
                        (isFavorite(video.videoId)
                          ? "btn-outline-danger"
                          : "btn-outline-primary")
                      }
                      onClick={() => handleToggleFavorite(video)}
                    >
                      {isFavorite(video.videoId)
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
