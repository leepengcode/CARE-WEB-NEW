import axios from "axios";

const cache = {};
const API_BASE = "https://externalchecking.com/api/api_rone_new/public/api/get_property_public";

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

export async function fetchPropertyById(id, userToken = null) {
  // If userToken is provided, use the authenticated endpoint
  if (userToken) {
    const url = "https://externalchecking.com/api/api_rone_new/public/api/get_property";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ property_id: id })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
       // Based on previous console logs, this endpoint returns an array.
       // If the array is empty or there's an error, the property wasn't found for this user/token.
       throw new Error(result.message || "Authenticated property not found");
    }

    // This endpoint returns an array, find the specific property by ID
    const property = result.data.find(p => String(p.id) === String(id));

    if (!property) {
       throw new Error("Property with given ID not found in authenticated response");
    }

    return property;
  }

  // For public properties, use the existing logic
  const API_BASE_PUBLIC = "https://externalchecking.com/api/api_rone_new/public/api/get_property_public";
  const params = {
    limit: 1000,
    offset: 0,
    // We don't include status here for public fetch based on previous logic
  };
  
  const url = new URL(API_BASE_PUBLIC);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString());
  const json = await response.json();
  
  if (json.error || !Array.isArray(json.data)) {
     throw new Error(json.message || "Public property fetch failed");
  }

  const property = json.data.find(p => String(p.id) === String(id));

  if (!property) {
    throw new Error("Public property not found");
  }

  return property;
}

export async function fetchAddress(code = "", types) {
  try {
    const response = await fetch(
      `https://externalchecking.com/api/api_rone_new/public/api/get_address?code=${code}`
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
    const response = await fetch('https://externalchecking.com/api/api_rone_new/public/api/agency-list-public');
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

export async function fetchPropertyForEdit(id, userToken) {
  if (!userToken) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `https://externalchecking.com/api/api_rone_new/public/api/get_property?property_id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.message || "Failed to fetch property");
  }

  return result.data;
}

