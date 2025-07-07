import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const articleApi = {
  // Get all articles
  getAllArticles: async (page = 1, limit = 12) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/articles`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get article by ID
  getArticleById: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/articles/${id}`
    );
    return response.data;
  },

  // Get featured articles
  getFeaturedArticles: async (limit = 6) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/articles/featured`,
      {
        params: { limit },
      }
    );
    return response.data;
  },

  // Search articles
  searchArticles: async (query, page = 1, limit = 12) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/articles/search`,
      {
        params: { q: query, page, limit },
      }
    );
    return response.data;
  },
};

export default articleApi; 