const cache = {};
const SLIDER_API_URL = "http://localhost:8001/api/get_slider";

export async function fetchSlider() {
  const key = "slider";
  if (cache[key]) {
    return cache[key];
  }
  const response = await fetch(SLIDER_API_URL);
  const result = await response.json();
  if (result.error || !result.data) throw new Error(result.message || "No data");
  cache[key] = result.data;
  return result.data;
} 