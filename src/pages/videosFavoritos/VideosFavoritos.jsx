// src/pages/videosFavoritos/VideosFavoritos.jsx
import { useEffect, useMemo, useState } from "react";
import { VideosApi } from "../../services/videos.api";

export default function VideosFavoritos() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar TODOS los favoritos al entrar a la página
  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites(searchText) {
    try {
      setLoading(true);
      setError("");
      const data = await VideosApi.getFavorites(searchText);
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus videos favoritos.");
    } finally {
      setLoading(false);
    }
  }

  // Quitar de favoritos
  async function handleRemoveFavorite(video) {
    try {
      setError("");
      await VideosApi.removeFavorite(video.videoId);
      setFavorites((prev) => prev.filter((f) => f.videoId !== video.videoId));
    } catch (err) {
      console.error(err);
      setError("No se pudo quitar el video de tus favoritos.");
    }
  }

  // Filtro local por título o canal
  const filteredFavorites = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return favorites;
    return favorites.filter(
      (v) =>
        v.title.toLowerCase().includes(text) ||
        v.channelTitle.toLowerCase().includes(text)
    );
  }, [favorites, search]);

  return (
    <div className="container-fluid px-0 px-md-1">
      {/* Título principal */}
      <div className="mb-3 px-3 px-md-0">
        <h2 className="fw-bold text-white mb-1" style={{ fontSize: "1.6rem" }}>
          Mis videos favoritos
        </h2>
        <p className="text-white-50 mb-0" style={{ maxWidth: "720px" }}>
          Aquí se muestran todos los videos que marcaste como favoritos.
        </p>
      </div>

      {/* Alertas de error */}
      {error && (
        <div className="alert alert-danger mx-3 mx-md-0" role="alert">
          {error}
        </div>
      )}

      {/* Buscador de favoritos */}
      <div className="card mb-3 shadow-sm mx-3 mx-md-0">
        <div className="card-body">
          <div className="row gy-2 gx-2 align-items-center">
            <div className="col-12 col-md-8">
              <label className="form-label fw-semibold">
                Buscar en tus favoritos
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por título o canal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-light w-100"
                onClick={() => loadFavorites(search)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Actualizando…
                  </>
                ) : (
                  "Actualizar desde el servidor"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de favoritos */}
      <div className="px-3 px-md-0">
        {loading && favorites.length === 0 && (
          <div className="text-white-50 mb-3">Cargando tus favoritos…</div>
        )}

        {!loading && favorites.length === 0 && (
          <p className="text-white-50">
            Aún no tienes videos favoritos. Desde el inicio puedes marcarlos con
            el botón <strong>“Agregar a favoritos”</strong>.
          </p>
        )}

        {filteredFavorites.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
            {filteredFavorites.map((video) => (
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
                        ? video.title.slice(0, 80) + "…"
                        : video.title}
                    </h6>
                    <p className="card-text text-muted small mb-1">
                      {video.channelTitle}
                    </p>
                    <p className="card-text small flex-grow-1">
                      {video.description
                        ? video.description.slice(0, 120) + "…"
                        : "Sin descripción"}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">
                        {video.publishedAt
                          ? new Date(video.publishedAt).getFullYear()
                          : ""}
                      </small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveFavorite(video)}
                      >
                        Quitar de favoritos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
