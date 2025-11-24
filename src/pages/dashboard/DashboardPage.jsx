// src/pages/dashboard/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { VideosApi } from "../../services/videos.api";

const CATEGORIES = [
  { label: "Todos", value: "" },
  { label: "Juegos", value: "videojuegos" },
  { label: "Fútbol", value: "fútbol" },
  { label: "Tecnología", value: "tecnología" },
  { label: "Cocina", value: "recetas de cocina" },
];

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesSearch, setFavoritesSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Cargar favoritos al entrar
  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites(searchText) {
    try {
      setLoadingFavorites(true);
      setError("");
      const data = await VideosApi.getFavorites(searchText);
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus favoritos.");
    } finally {
      setLoadingFavorites(false);
    }
  }

  // Búsqueda genérica (la usan el formulario y los chips)
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

  function isFavorite(videoId) {
    return favorites.some((f) => f.videoId === videoId);
  }

  async function handleToggleFavorite(video) {
    try {
      setError("");

      if (isFavorite(video.videoId)) {
        await VideosApi.removeFavorite(video.videoId);
        setFavorites((prev) => prev.filter((f) => f.videoId !== video.videoId));
      } else {
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
      // "Todos": limpiamos resultados y mostramos feed basado en favoritos
      setResults([]);
      return;
    }

    setQuery(cat.label);
    await runSearch(cat.value);
  }

  // Filtro de favoritos del panel derecho
  const filteredFavorites = useMemo(() => {
    const text = favoritesSearch.trim().toLowerCase();
    if (!text) return favorites;
    return favorites.filter(
      (v) =>
        v.title.toLowerCase().includes(text) ||
        v.channelTitle.toLowerCase().includes(text)
    );
  }, [favorites, favoritesSearch]);

  // Feed: si hay resultados de búsqueda, usamos esos;
  // si no, usamos favoritos en orden aleatorio (como “recomendados”).
  const shuffledFavorites = useMemo(() => {
    const arr = [...favorites];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [favorites]);

  const feedVideos = results.length > 0 ? results : shuffledFavorites;

  // Texto de ayuda en el encabezado de Resultados
  const resultsSubtitle = (() => {
    if (results.length > 0) {
      return `${results.length} resultado(s) de búsqueda`;
    }
    if (favorites.length > 0) {
      return "Basado en tus videos favoritos";
    }
    return "Realiza una búsqueda para empezar";
  })();

  return (
    <div className="container-fluid px-0 px-md-1">
      {/* Título principal tipo YouTube */}
      <div className="mb-3 px-3 px-md-0">
        <h2 className="fw-bold text-white mb-1" style={{ fontSize: "1.6rem" }}>
          Busca videos de YouTube
        </h2>
        <p className="text-white-50 mb-0" style={{ maxWidth: "720px" }}>
          Márcalos como favoritos y gestiona tu lista personal.
        </p>
      </div>

      {/* Alertas de error */}
      {error && (
        <div className="alert alert-danger mx-3 mx-md-0" role="alert">
          {error}
        </div>
      )}

      {/* Buscador principal */}
      <div className="card mb-3 shadow-sm mx-3 mx-md-0">
        <div className="card-body">
          <form
            className="row gy-2 gx-2 align-items-center"
            onSubmit={handleSearchSubmit}
          >
            <div className="col-12 col-md-8">
              <label className="form-label fw-semibold">
                Buscar videos en YouTube
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. React tutorial, música lo-fi, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loadingSearch || !query.trim()}
              >
                {loadingSearch ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Buscando...
                  </>
                ) : (
                  "Buscar videos"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Chips de categorías tipo YouTube */}
      <div className="mb-3 px-3 px-md-0">
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
                  activeCategory === cat.label ? undefined : "rgba(0,0,0,0.15)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="row g-3 g-lg-4 mx-0 mx-md-0">
        {/* Resultados / Feed principal */}
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-2 px-3 px-md-0">
            <h5 className="mb-0 fw-semibold text-white">Resultados</h5>
            <small className="text-white-50">{resultsSubtitle}</small>
          </div>

          {feedVideos.length === 0 && (
            <div className="text-white-50 fst-italic px-3 px-md-0">
              Aún no hay resultados. Escribe algo en el buscador de arriba, toca
              una categoría (Juegos, Fútbol, Tecnología, Cocina) y presiona{" "}
              <strong>“Buscar videos”</strong>.
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 g-3 px-3 px-md-0">
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

        {/* Favoritos: tarjetas tipo grid */}
        <div className="col-12 col-lg-4">
          <div className="card it-favorites-card">
            <div className="card-header bg-white it-favorites-card-header px-3 pt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Mis favoritos</h5>
                {loadingFavorites && (
                  <div
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filtrar por título o canal"
                  value={favoritesSearch}
                  onChange={(e) => setFavoritesSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="card-body">
              {favorites.length === 0 && !loadingFavorites && (
                <p className="text-muted small mb-0">
                  Aún no tienes videos favoritos. Desde los resultados puedes
                  marcarlos con el botón <strong>“Agregar a favoritos”</strong>.
                </p>
              )}

              <div className="it-favorites-grid mt-2">
                {filteredFavorites.map((video) => (
                  <div key={video.videoId} className="it-favorite-item">
                    {video.thumbnailUrl && (
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="it-favorite-thumb"
                        />
                      </a>
                    )}
                    <div className="it-favorite-body">
                      <div className="it-favorite-title">
                        {video.title.length > 65
                          ? video.title.slice(0, 65) + "..."
                          : video.title}
                      </div>
                      <div className="it-favorite-channel">
                        {video.channelTitle}
                      </div>
                      <div className="it-favorite-actions">
                        <small className="text-muted">
                          {new Date(video.publishedAt).getFullYear()}
                        </small>
                        <button
                          type="button"
                          className="btn it-btn-outline-danger-soft"
                          onClick={() => handleToggleFavorite(video)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {favorites.length > 0 && (
                <button
                  type="button"
                  className="btn btn-link btn-sm mt-2 p-0"
                  onClick={() => loadFavorites(favoritesSearch)}
                >
                  Actualizar lista desde el servidor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
