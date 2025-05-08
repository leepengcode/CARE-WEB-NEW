const cache = {};
const API_BASE = "http://localhost:8001/api/get_property_public";

function getCacheKey(params) {
  return JSON.stringify(params);
}

async function fetchProperties(params) {
  const key = getCacheKey(params);
  if (cache[key]) {
    return cache[key];
  }
  const url = new URL(API_BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const response = await fetch(url.toString());
  const result = await response.json();
  if (result.error || !result.data) throw new Error(result.message || "No data");
  cache[key] = result.data;
  return result.data;
}

export async function fetchRecentlyAdded(limit = 12) {
  return fetchProperties({ limit });
}

export async function fetchMostLiked(limit = 12) {
  return fetchProperties({ limit, most_liked: 1 });
}

export async function fetchMostViewed(limit = 12) {
  return fetchProperties({ limit, top_rated: 1 });
} 