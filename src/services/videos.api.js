// src/services/videos.api.js
import { http } from "./http";

// Endpoint base del backend para favoritos
const FAVORITES_URL = "/Videos/favorites";

// URL de búsqueda de YouTube
const YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Normaliza el objeto de YouTube a lo que espera el backend.
 */
const mapYoutubeItemToVideo = (item) => ({
  videoId: item.id.videoId,
  title: item.snippet.title,
  description: item.snippet.description,
  channelTitle: item.snippet.channelTitle,
  channelId: item.snippet.channelId,
  thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? "",
  publishedAt: item.snippet.publishedAt,
});

export const VideosApi = {
  /**
   * Busca videos en YouTube.
   */
  async searchYoutube(query, signal) {
    if (!YT_API_KEY) {
      throw new Error(
        "Falta configurar VITE_YOUTUBE_API_KEY en tu archivo .env"
      );
    }

    const url = new URL(YT_SEARCH_URL);
    url.searchParams.set("key", YT_API_KEY);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "12");

    const res = await fetch(url.toString(), { signal });

    if (!res.ok) {
      throw new Error("Error al buscar videos en YouTube");
    }

    const data = await res.json();
    return data.items.map(mapYoutubeItemToVideo);
  },

  /**
   * Obtiene la lista de favoritos del usuario autenticado.
   * Puedes pasar un texto de búsqueda opcional.
   */
  async getFavorites(search) {
    const params = {};
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }
    // http.get ya se encarga de agregar /api y el querystring
    return http.get(FAVORITES_URL, { params });
  },

  /**
   * Agrega un video a favoritos.
   */
  async addFavorite(video) {
    return http.post(FAVORITES_URL, video);
  },

  /**
   * Quita un video de favoritos por id.
   */
  async removeFavorite(videoId) {
    return http.del(`${FAVORITES_URL}/${encodeURIComponent(videoId)}`);
  },
};
