import axios from "axios";

const cache = {};
const API_BASE = "http://127.0.0.1:8000/api/get_property_public";

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

export async function fetchAllProperties(page = 1, limit = 12, filters = {}) {
  const offset = (page - 1) * limit;
  const params = {
    limit,
    offset,
    ...filters, // Spread the filters into the params object
  };
  const url = new URL(API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) { // Only append non-null values
      url.searchParams.append(key, value);
    }
  });
  console.log("Fetching properties with URL:", url.toString()); // Debug log
  const response = await fetch(url.toString());
  const json = await response.json();
  console.log("API response:", json); // Debug log
  return {
    data: Array.isArray(json.data) ? json.data : [],
    total: json.total || 0,
  };
}

export async function fetchPropertyById(id) {
  const properties = await fetchAllProperties(1, 1000);
  const property = properties.data.find(p => String(p.id) === String(id));
  if (!property) {
    throw new Error("Property not found");
  }
  return property;
}

export async function fetchAddress(code = "", types) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/get_address?code=${code}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    if (!Array.isArray(result)) {
      console.error(
        `Expected array for code=${code}, types=${types}, got:`,
        result
      );
      return [{ value: null, label: "No data available" }];
    }

    const options = result
      .filter((item) => types.includes(item.type))
      .map((item) => ({
        value: item.code,
        label: item.name,
      }));

    if (options.length === 0) {
      return [{ value: null, label: "No data available" }];
    }

    return [{ value: null, label: "All" }, ...options];
  } catch (err) {
    console.error(`Error fetching types=${types} for code=${code}:`, err);
    return [{ value: null, label: "No data available" }];
  }
}

export async function fetchAgencies() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/agency-list-public');
    const result = await response.json();
    if (result.error) throw new Error(result.message || "Failed to fetch agencies");
    return result.data;
  } catch (error) {
    console.error('Error fetching agencies:', error);
    throw error;
  }
}

export async function toggleFavorite(propertyId, type, userToken) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/add_favourite`,
    {
      property_id: propertyId,
      type, // 1 = add, 0 = remove
    },
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return res.data;
}

