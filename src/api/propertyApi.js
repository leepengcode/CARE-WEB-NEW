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
  console.log("Fetching Properties with URL:", url.toString()); // Debug log
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
    console.log("Fetching property with ID:", id);
    console.log("Using authenticated endpoint");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ 
        property_id: id,
        role: "researcher", // Add role parameter
        userid: null // Add userid parameter
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (result.error) {
      throw new Error(result.message || "Failed to fetch property");
    }

    if (!result.data || !Array.isArray(result.data)) {
      console.error("Invalid response format:", result);
      throw new Error("Invalid response format from server");
    }

    // Find the specific property in the array
    const property = result.data.find(p => String(p.id) === String(id));
    console.log("Found property:", property);

    if (!property) {
      console.error("Property not found in response data");
      throw new Error("Property not found");
    }

    // Map the property data to match the expected format
    const mappedProperty = {
      ...property,
      title_image: property.image || property.title_image,
      description: property.description || property.descriptions || "",
      propery_type: property.propery_type || property.status,
      post_created: property.post_created || property.time,
      type: property.type || property.category?.category || "",
      status: property.state || property.status,
      price: property.price ? parseFloat(String(property.price).replace(/[^0-9.-]+/g, "")) || 0 : 0,
      gallery: property.gallery || [],
      category: property.category?.category ? property.category.category : {
        category: property.category || "",
        image: property.category_image || ""
      }
    };

    console.log("Mapped property:", mappedProperty);
    return mappedProperty;
  }

  // For public Properties, use the public endpoint
  const url = "https://externalchecking.com/api/api_rone_new/public/api/get_property";
  console.log("Fetching public property with ID:", id);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ 
      property_id: id,
      role: "researcher", // Add role parameter
      userid: null // Add userid parameter
    })
  });
  
  const result = await response.json();
  console.log("Public API Response:", result);

  if (result.error) {
    throw new Error(result.message || "Failed to fetch property");
  }

  if (!result.data || !Array.isArray(result.data)) {
    console.error("Invalid response format:", result);
    throw new Error("Invalid response format from server");
  }

  // Find the specific property in the array
  const property = result.data.find(p => String(p.id) === String(id));
  console.log("Found public property:", property);

  if (!property) {
    console.error("Property not found in response data");
    throw new Error("Property not found");
  }

  // Map the property data to match the expected format
  const mappedProperty = {
    ...property,
    title_image: property.image || property.title_image,
    description: property.description || property.descriptions || "",
    propery_type: property.propery_type || property.status,
    post_created: property.post_created || property.time,
    type: property.type || property.category?.category || "",
    status: property.state || property.status,
    price: property.price ? parseFloat(String(property.price).replace(/[^0-9.-]+/g, "")) || 0 : 0,
    gallery: property.gallery || [],
    category: property.category?.category ? property.category.category : {
      category: property.category || "",
      image: property.category_image || ""
    }
  };

  console.log("Mapped public property:", mappedProperty);
  return mappedProperty;
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

export async function fetchPropertyForEdit(id, userToken, role, userid) {
  if (!userToken) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    "https://externalchecking.com/api/api_rone_new/public/api/get_property",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id, role, userid })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.message || "Failed to fetch property");
  }

  // Find the specific property in the array
  const property = result.data.find(p => String(p.id) === String(id));
  if (!property) {
    throw new Error("Property not found");
  }

  return property;
}

