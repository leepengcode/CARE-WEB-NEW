import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import LoginPrompt from "../LoginPrompt";
import PageComponents from "../PageComponents";
import CustomDropdown from "../shared/CustomDropdown";

// Define libraries as a static constant outside the component
const googleMapLibraries = ["places"];

// Add toast function at the top of the file, after imports
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed right-8 top-8 z-50 px-6 py-3 rounded shadow text-white text-center transition-all duration-300 opacity-0 translate-x-10 ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600"
  }`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-x-10");
    toast.classList.add("opacity-100", "translate-x-0");
  }, 10);
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-x-0");
    toast.classList.add("opacity-0", "translate-x-10");
    setTimeout(() => document.body.removeChild(toast), 400);
  }, 2000);
}

export default function AddProperty() {
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: googleMapLibraries,
  });

  // State to manage checked facilities and their distances
  const [facilities, setFacilities] = useState({});

  // State for property details
  const [propertyType, setPropertyType] = useState(null);
  const [rentDurationType, setRentDurationType] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for address dropdowns and selections
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [countryOptions] = useState([
    { value: "", label: "Select" },
    { value: "KH", label: "Cambodia" },
  ]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("KH");

  // State for facilities
  const [facilityOptions, setFacilityOptions] = useState([]);

  // State for additional property facilities (Bathroom, Bedroom, etc.)
  const [parameterValues, setParameterValues] = useState({});
  const [relevantParameters, setRelevantParameters] = useState([]);

  // State for map-related functionality
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 11.5564, lng: 104.9282 }); // Phnom Penh
  const [markerPosition, setMarkerPosition] = useState({
    lat: 11.5564,
    lng: 104.9282,
  });
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // State for image previews
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [threeDImagePreview, setThreeDImagePreview] = useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);

  // Fetch categories from API
  const { userToken } = useStateContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCategories = async () => {
    try {
      // If no token, we can't fetch categories that require authentication
      if (!userToken) {
        console.warn("No user token available to fetch categories.");
        setCategoryOptions([{ value: "", label: "Login to load categories" }]);
        return;
      }

      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/get_categories",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (!Array.isArray(result.data)) {
        console.error("API response data is not an array:", result);
        setCategoryOptions([{ value: "", label: "Error loading categories" }]);
        return;
      }

      const options = result.data.map((category) => ({
        value: category.id,
        label: category.category,
      }));

      setCategoryOptions([{ value: "", label: "Select Category" }, ...options]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryOptions([{ value: "", label: "Error loading categories" }]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userToken]); // Add userToken to dependency array

  // Function to fetch parameters based on selected category
  const fetchParametersByCategory = async (categoryId) => {
    console.log(`Fetching parameters for category: ${categoryId}`);

    try {
      if (!userToken) {
        console.warn("No user token available to fetch parameters.");
        return;
      }

      // First, try to fetch parameters from the API
      const response = await fetch(
        `https://externalchecking.com/api/api_rone_new/public/api/get_parameters?category_id=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Parameters API response:", result);

      if (result.error === false && Array.isArray(result.data)) {
        const parameters = result.data.map((param) => ({
          id: param.id.toString(),
          name: param.name,
          type_of_parameter: param.type_of_parameter,
          type_values: param.type_values,
          image: param.image,
          categories: [categoryId.toString()],
        }));

        console.log("Processed parameters:", parameters);
        setRelevantParameters(parameters);
        setParameterValues({});
      } else {
        // If API fails, use fallback parameters
        console.warn("Using fallback parameters due to API error");
        const fallbackParameters = [
          {
            id: "24",
            name: "Bathroom",
            type_of_parameter: "number",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270703.0155.png",
            categories: [categoryId.toString()],
          },
          {
            id: "25",
            name: "Bedroom",
            type_of_parameter: "number",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270661.1098.png",
            categories: [categoryId.toString()],
          },
          {
            id: "31",
            name: "Number Of Floor",
            type_of_parameter: "number",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702276389.4782.png",
            categories: [categoryId.toString()],
          },
          {
            id: "32",
            name: "Tittle",
            type_of_parameter: "dropdown",
            type_values: ["Hard Tittle", "Soft Tittle", "Normal"],
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270797.8818.png",
            categories: [categoryId.toString()],
          },
          {
            id: "33",
            name: "Land size",
            type_of_parameter: "textbox",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270336.9154.png",
            categories: [categoryId.toString()],
          },
          {
            id: "34",
            name: "House size",
            type_of_parameter: "textbox",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702276849.3741.png",
            categories: [categoryId.toString()],
          },
          {
            id: "38",
            name: "Tittle No",
            type_of_parameter: "textbox",
            type_values: null,
            image:
              "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1694673423.9107.png",
            categories: [categoryId.toString()],
          },
        ];

        console.log("Using fallback parameters:", fallbackParameters);
        setRelevantParameters(fallbackParameters);
        setParameterValues({});
      }
    } catch (err) {
      console.error("Error fetching parameters:", err);
      // Use fallback parameters in case of error
      const fallbackParameters = [
        {
          id: "24",
          name: "Bathroom",
          type_of_parameter: "number",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270703.0155.png",
          categories: [categoryId.toString()],
        },
        {
          id: "25",
          name: "Bedroom",
          type_of_parameter: "number",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270661.1098.png",
          categories: [categoryId.toString()],
        },
        {
          id: "31",
          name: "Number Of Floor",
          type_of_parameter: "number",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702276389.4782.png",
          categories: [categoryId.toString()],
        },
        {
          id: "32",
          name: "Tittle",
          type_of_parameter: "dropdown",
          type_values: ["Hard Tittle", "Soft Tittle", "Normal"],
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270797.8818.png",
          categories: [categoryId.toString()],
        },
        {
          id: "33",
          name: "Land size",
          type_of_parameter: "textbox",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702270336.9154.png",
          categories: [categoryId.toString()],
        },
        {
          id: "34",
          name: "House size",
          type_of_parameter: "textbox",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1702276849.3741.png",
          categories: [categoryId.toString()],
        },
        {
          id: "38",
          name: "Tittle No",
          type_of_parameter: "textbox",
          type_values: null,
          image:
            "https://externalchecking.com/api/api_rone_new/public/images//parameter_img/1694673423.9107.png",
          categories: [categoryId.toString()],
        },
      ];

      console.log(
        "Using fallback parameters due to error:",
        fallbackParameters
      );
      setRelevantParameters(fallbackParameters);
      setParameterValues({});
    }
  };

  // Effect to fetch parameters when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchParametersByCategory(selectedCategory);
    } else {
      setRelevantParameters([]);
      setParameterValues({});
    }
  }, [selectedCategory]);

  const handleFacilityChange = (facilityId, isChecked) => {
    setFacilities((prevFacilities) => {
      const newFacilities = { ...prevFacilities };
      if (isChecked) {
        newFacilities[facilityId] = { facility_id: facilityId, distance: "" };
      } else {
        delete newFacilities[facilityId];
      }
      return newFacilities;
    });
  };

  const handleDistanceChange = (facilityId, distance) => {
    setFacilities((prevFacilities) => ({
      ...prevFacilities,
      [facilityId]: { ...prevFacilities[facilityId], distance: distance },
    }));
  };

  // Fetch facilities from API
  const fetchFacilities = async () => {
    try {
      if (!userToken) {
        console.warn("No user token available to fetch facilities.");
        return;
      }

      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/get_facilities",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (result.error === false && Array.isArray(result.data)) {
        const options = result.data.map((facility) => ({
          id: facility.id,
          name: facility.name || facility.category,
        }));
        setFacilityOptions(options);
      } else {
        console.error("Invalid facilities data format:", result);
      }
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [userToken]);

  // Function to fetch address data
  const fetchAddress = async (code = "", types) => {
    try {
      const response = await fetch(
        `https://externalchecking.com/api/api_rone_new/public/api/get_address?code=${code}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (!Array.isArray(result)) {
        return [{ value: "", label: "No data available" }];
      }

      const options = result
        .filter((item) => types.includes(item.type))
        .map((item) => ({
          value: item.code,
          label: item.name,
        }));

      if (options.length === 0) {
        return [{ value: "", label: "No data available" }];
      }

      return [{ value: "", label: "Select" }, ...options];
    } catch (err) {
      console.error(`Error fetching types=${types} for code=${code}:`, err);
      return [{ value: "", label: "Error fetching data" }];
    }
  };

  // Fetch provinces on component mount
  useEffect(() => {
    fetchAddress("855", ["province"]).then(setProvinceOptions);
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetchAddress(selectedProvince, ["district", "khan"]).then(
        setDistrictOptions
      );
      setSelectedDistrict("");
      setCommuneOptions([]);
      setSelectedCommune("");
      setVillageOptions([]);
      setSelectedVillage("");
    } else {
      setDistrictOptions([]);
      setSelectedDistrict("");
      setCommuneOptions([]);
      setSelectedCommune("");
      setVillageOptions([]);
      setSelectedVillage("");
    }
  }, [selectedProvince]);

  // Fetch communes when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchAddress(selectedDistrict, ["commune", "sangkat"]).then(
        setCommuneOptions
      );
      setSelectedCommune("");
      setVillageOptions([]);
      setSelectedVillage("");
    } else {
      setCommuneOptions([]);
      setSelectedCommune("");
      setVillageOptions([]);
      setSelectedVillage("");
    }
  }, [selectedDistrict]);

  // Fetch villages when commune changes
  useEffect(() => {
    if (selectedCommune) {
      fetchAddress(selectedCommune, ["village"]).then(setVillageOptions);
      setSelectedVillage("");
    } else {
      setVillageOptions([]);
      setSelectedVillage("");
    }
  }, [selectedCommune]);

  // Handle search box place changes
  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setCenter({ lat, lng });
    setMarkerPosition({ lat, lng });
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  // Handle map click to update marker and coordinates
  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  // Handle file selection and preview
  const handleFileChange = (event, setPreview, isMultiple = false) => {
    const files = event.target.files;
    if (!files) return;

    if (isMultiple) {
      const previews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      }));
      setPreview((prev) => [...prev, ...previews]); // Append new files to existing ones
    } else {
      const file = files[0];
      const preview = {
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      };
      setPreview(preview);
    }
  };

  // Remove preview
  const removePreview = (setPreview, index = null) => {
    if (index !== null) {
      setPreview((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    // Create an object to store validation errors
    const validationErrors = {};

    // Validate required fields
    if (!selectedCategory) {
      validationErrors.category = "Please select a category";
    }

    if (!propertyType) {
      validationErrors.propertyType = "Please select a property type";
    }

    if (!e.target.title.value) {
      validationErrors.title = "Please enter a title";
    }

    if (!titleImagePreview) {
      validationErrors.titleImage = "Please upload a title image";
    }

    if (!e.target.description.value) {
      validationErrors.description = "Please enter a description";
    }

    if (propertyType === "1" && !e.target.price.value) {
      validationErrors.price = "Please enter a price";
    }

    if (propertyType === "2" && !rentDurationType) {
      validationErrors.rentDuration = "Please select rent duration";
    }

    if (!latitude || !longitude) {
      validationErrors.location = "Please select a location on the map";
    }

    if (!e.target.client_address.value) {
      validationErrors.clientAddress = "Please enter client address";
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      // Get the first error field
      const firstErrorField = Object.keys(validationErrors)[0];

      // Find the corresponding element
      let elementToScroll;
      switch (firstErrorField) {
        case "category":
          elementToScroll = document.getElementById("category_id");
          break;
        case "propertyType":
          elementToScroll = document.querySelector(
            'input[name="property_type"]'
          );
          break;
        case "title":
          elementToScroll = document.getElementById("title");
          break;
        case "titleImage":
          elementToScroll = document.getElementById("title_image");
          break;
        case "description":
          elementToScroll = document.getElementById("description");
          break;
        case "price":
          elementToScroll = document.getElementById("price");
          break;
        case "rentDuration":
          elementToScroll = document.querySelector(
            'select[name="rentdurationtype"]'
          );
          break;
        case "location":
          elementToScroll = document.querySelector(".google-map-container");
          break;
        case "clientAddress":
          elementToScroll = document.getElementById("client_address");
          break;
        default:
          elementToScroll = document.querySelector("form");
      }

      // Scroll to the element with smooth behavior
      if (elementToScroll) {
        elementToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add a highlight effect
        elementToScroll.classList.add("highlight-error");
        setTimeout(() => {
          elementToScroll.classList.remove("highlight-error");
        }, 2000);
      }

      // Show error message
      const errorMessage = validationErrors[firstErrorField];
      setFormError(errorMessage);
      showToast(errorMessage, "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Required fields
      formData.append("package_id", "1");
      formData.append("category_id", selectedCategory);
      formData.append("userid", userToken);

      // Property details
      formData.append("title", e.target.title.value);
      formData.append("description", e.target.description.value || "");
      formData.append("property_type", propertyType === "1" ? "0" : "1");
      formData.append("price", e.target.price.value || "0");
      formData.append("rentduration", rentDurationType || "");

      // Location details
      formData.append("country", selectedCountry);
      formData.append("province", selectedProvince || "");
      formData.append("district", selectedDistrict || "");
      formData.append("commune", selectedCommune || "");
      formData.append("village", selectedVillage || "");
      formData.append("latitude", latitude || "");
      formData.append("longitude", longitude || "");
      formData.append("client_address", e.target.client_address.value || "");
      formData.append("address", e.target.address.value || "");

      // Owner details
      formData.append("owner_id", e.target.owner_id.value || "");
      formData.append("owner_name", e.target.owner_name.value || "");
      formData.append("owner_phone", e.target.owner_phone.value || "");
      formData.append("owner_address", e.target.owner_address.value || "");
      formData.append("owner_note", e.target.owner_note.value || "");

      // Images
      if (titleImagePreview) {
        try {
          const titleImageFile = await fetch(titleImagePreview.url).then((r) =>
            r.blob()
          );
          formData.append("title_image", titleImageFile, "title_image.jpg");
        } catch (error) {
          console.error("Error processing title image:", error);
          setFormError("Error processing title image. Please try again.");
          return;
        }
      }

      if (threeDImagePreview) {
        try {
          const threeDImageFile = await fetch(threeDImagePreview.url).then(
            (r) => r.blob()
          );
          formData.append("threeD_image", threeDImageFile, "threeD_image.jpg");
        } catch (error) {
          console.error("Error processing 3D image:", error);
          setFormError("Error processing 3D image. Please try again.");
          return;
        }
      }

      // Gallery images
      if (galleryImagesPreview.length > 0) {
        try {
          // Process gallery images sequentially to ensure proper order
          for (const image of galleryImagesPreview) {
            const response = await fetch(image.url);
            const blob = await response.blob();
            // Create a File object with proper name and type
            const file = new File([blob], `gallery_${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            formData.append("gallery_images[]", file);
          }
        } catch (error) {
          console.error("Error processing gallery images:", error);
          setFormError("Error processing gallery images. Please try again.");
          return;
        }
      }

      // Video link
      formData.append("video_link", e.target.video_link.value || "");

      // Facilities
      // Append each facility property individually using bracket notation
      Object.entries(facilities).forEach(([facilityId, data]) => {
        formData.append(
          `facilities[${facilityId}][facility_id]`,
          parseInt(facilityId)
        );
        formData.append(
          `facilities[${facilityId}][distance]`,
          data.distance || "0"
        );
      });

      // Format parameters correctly
      if (relevantParameters.length > 0) {
        // Create an array of parameter objects
        const parametersArray = relevantParameters
          .filter((param) => parameterValues[param.id]) // Only include parameters that have values
          .map((param) => ({
            parameter_id: param.id,
            value: parameterValues[param.id],
          }));

        // Log the parameters array for debugging
        console.log("Parameters array:", parametersArray);

        // Append each parameter to formData
        parametersArray.forEach((param, index) => {
          formData.append(
            `parameters[${index}][parameter_id]`,
            param.parameter_id
          );
          formData.append(`parameters[${index}][value]`, param.value);
        });
      }

      // Log the final form data
      console.log("Final form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Make API call
      console.log("Request Headers:", {
        Authorization: `Bearer ${userToken}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      });

      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/post_property",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: formData,
        }
      );

      // Log response details
      console.log("Response Status:", response.status);
      console.log(
        "Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      console.log("Response Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.error) {
        const errorMessage =
          result.message ||
          "Failed to submit property. Please check your input and try again.";
        setFormError(errorMessage);
        showToast(errorMessage, "error");
      } else {
        showToast("Property added successfully!", "success");
        // Reset form or redirect
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      let errorMessage;
      if (error.message === "Server returned non-JSON response") {
        errorMessage =
          "Server error occurred. Please check the console for details and try again.";
      } else {
        errorMessage =
          error.message || "Failed to submit property. Please try again.";
      }
      setFormError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the parameter input rendering to handle different types
  const renderParameterInput = (param) => {
    switch (param.type_of_parameter) {
      case "number":
        return (
          <input
            type="number"
            name={`parameter_${param.id}`}
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues({
                ...parameterValues,
                [param.id]: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case "dropdown":
        return (
          <select
            name={`parameter_${param.id}`}
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues({
                ...parameterValues,
                [param.id]: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select {param.name}</option>
            {param.type_values &&
              param.type_values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            name={`parameter_${param.id}`}
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues({
                ...parameterValues,
                [param.id]: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
    }
  };

  if (!userToken) return <LoginPrompt />;

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <h1 className="text-2xl font-semibold mb-6">Add New Property</h1>

        {formError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Owner Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Owner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="owner_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner ID
                </label>
                <input
                  type="text"
                  name="owner_id"
                  id="owner_id"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div></div>
              <div>
                <label
                  htmlFor="owner_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  id="owner_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="owner_phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="owner_phone"
                  id="owner_phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="owner_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <textarea
                  name="owner_address"
                  id="owner_address"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="owner_note"
                  className="block text-sm font-medium text-gray-700"
                >
                  Note
                </label>
                <textarea
                  name="owner_note"
                  id="owner_note"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Details and Description Sections Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Details Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  {/* Assuming Category is a dropdown, replace with CustomDropdown if needed */}
                  <CustomDropdown
                    options={categoryOptions}
                    value={{
                      value: selectedCategory,
                      label:
                        categoryOptions.find(
                          (opt) => opt.value === selectedCategory
                        )?.label || "Select Category",
                    }}
                    onChange={(option) => setSelectedCategory(option.value)}
                    placeholder="Select Category"
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="property_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="property_type"
                        value="1"
                        checked={propertyType === "1"}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="form-radio"
                      />
                      <span className="ml-2">For Sell</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="property_type"
                        value="2"
                        checked={propertyType === "2"}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="form-radio"
                      />
                      <span className="ml-2">For Rent</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Price and Duration Fields */}
                {propertyType === "2" && (
                  <div>
                    <label
                      htmlFor="rentdurationtype"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration For Price <span className="text-red-500">*</span>
                    </label>
                    {/* Assuming Duration is a dropdown */}
                    <CustomDropdown
                      options={[
                        { value: "", label: "Select" },
                        { value: "Daily", label: "Daily" },
                        { value: "Monthly", label: "Monthly" },
                        { value: "Yearly", label: "Yearly" },
                      ]}
                      value={{
                        value: rentDurationType,
                        label: rentDurationType || "Select",
                      }}
                      onChange={(option) => setRentDurationType(option.value)}
                      placeholder="Select Duration"
                    />
                  </div>
                )}

                {(propertyType === "1" || propertyType === "2") && (
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price($)
                      {propertyType === "1" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Near By Places Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Near By Places</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilityOptions.map((facility) => (
                <div key={facility.id} className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id={`facility_${facility.id}`}
                      name="facilities[]"
                      type="checkbox"
                      value={facility.id}
                      checked={!!facilities[facility.id]}
                      onChange={(e) =>
                        handleFacilityChange(facility.id, e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`facility_${facility.id}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {facility.name}
                    </label>
                  </div>
                  {facilities[facility.id] && (
                    <div className="mt-2">
                      <label
                        htmlFor={`distance_${facility.id}`}
                        className="block text-sm text-gray-700"
                      >
                        Distance (km)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        name={`facilities[${facility.id}].distance`}
                        id={`distance_${facility.id}`}
                        placeholder="Enter distance"
                        value={facilities[facility.id].distance}
                        onChange={(e) =>
                          handleDistanceChange(facility.id, e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Facilities Section (Bathroom, Bedroom, etc.) */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {relevantParameters.map((param) => (
                <div key={param.id}>
                  <label
                    htmlFor={`parameter_${param.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {param.name}
                  </label>
                  {renderParameterInput(param)}
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Map with Search Bar */}
              <div className="md:col-span-1">
                <div className="md:col-span-1">
                  {loadError ? (
                    <div className="text-red-500">Error loading maps</div>
                  ) : !isLoaded ? (
                    <div className="flex items-center justify-center h-[490px] bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <StandaloneSearchBox
                        onLoad={(ref) => setSearchBox(ref)}
                        onPlacesChanged={onPlacesChanged}
                      >
                        <input
                          type="text"
                          placeholder="Enter a location"
                          className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2"
                        />
                      </StandaloneSearchBox>
                      <GoogleMap
                        mapContainerStyle={{ height: "490px", width: "100%" }}
                        center={center}
                        zoom={13}
                        onClick={onMapClick}
                      >
                        <Marker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={onMapClick}
                        />
                      </GoogleMap>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Fields Container */}
              <div className="md:col-span-1 grid grid-cols-1 gap-4 mt-10">
                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <CustomDropdown
                    options={countryOptions}
                    value={{
                      value: selectedCountry,
                      label: countryOptions.find(
                        (opt) => opt.value === selectedCountry
                      )?.label,
                    }}
                    onChange={(option) => setSelectedCountry(option.value)}
                    placeholder="Select Country"
                  />
                </div>

                {/* Province and District in a row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Province */}
                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Province
                    </label>
                    <CustomDropdown
                      options={provinceOptions}
                      value={{
                        value: selectedProvince,
                        label: provinceOptions.find(
                          (opt) => opt.value === selectedProvince
                        )?.label,
                      }}
                      onChange={(option) => setSelectedProvince(option.value)}
                      placeholder="Select Province"
                    />
                  </div>
                  {/* District */}
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      District
                    </label>
                    <CustomDropdown
                      options={districtOptions}
                      value={{
                        value: selectedDistrict,
                        label: districtOptions.find(
                          (opt) => opt.value === selectedDistrict
                        )?.label,
                      }}
                      onChange={(option) => setSelectedDistrict(option.value)}
                      placeholder="Select District"
                      isDisabled={
                        !selectedProvince || provinceOptions.length <= 1
                      }
                    />
                  </div>
                </div>

                {/* Commune and Village in a row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Commune */}
                  <div>
                    <label
                      htmlFor="commune"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Commune
                    </label>
                    <CustomDropdown
                      options={communeOptions}
                      value={{
                        value: selectedCommune,
                        label: communeOptions.find(
                          (opt) => opt.value === selectedCommune
                        )?.label,
                      }}
                      onChange={(option) => setSelectedCommune(option.value)}
                      placeholder="Select Commune"
                      isDisabled={
                        !selectedDistrict || districtOptions.length <= 1
                      }
                    />
                  </div>
                  {/* Village */}
                  <div>
                    <label
                      htmlFor="village"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Village
                    </label>
                    <CustomDropdown
                      options={villageOptions}
                      value={{
                        value: selectedVillage,
                        label: villageOptions.find(
                          (opt) => opt.value === selectedVillage
                        )?.label,
                      }}
                      onChange={(option) => setSelectedVillage(option.value)}
                      placeholder="Select Village"
                      isDisabled={
                        !selectedCommune || communeOptions.length <= 1
                      }
                    />
                  </div>
                </div>

                {/* Latitude and Longitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Latitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      id="latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Longitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      id="longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Client Address */}
                <div>
                  <label
                    htmlFor="client_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Client Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_address"
                    id="client_address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Title Image */}
              <div>
                <label
                  htmlFor="title_image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title Image
                </label>
                <div className="mt-1">
                  {titleImagePreview ? (
                    <div className="relative">
                      <img
                        src={titleImagePreview.url}
                        alt="Title Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(setTitleImagePreview)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        ({titleImagePreview.size})
                      </p>
                    </div>
                  ) : (
                    <label
                      htmlFor="title_image"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      Drag & Drop your files or Browse
                    </label>
                  )}
                  <input
                    type="file"
                    name="title_image"
                    id="title_image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setTitleImagePreview)}
                  />
                </div>
              </div>

              {/* 3D Image */}
              <div>
                <label
                  htmlFor="threeD_image"
                  className="block text-sm font-medium text-gray-700"
                >
                  3D Image
                </label>
                <div className="mt-1">
                  {threeDImagePreview ? (
                    <div className="relative">
                      <img
                        src={threeDImagePreview.url}
                        alt="3D Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(setThreeDImagePreview)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        ({threeDImagePreview.size})
                      </p>
                    </div>
                  ) : (
                    <label
                      htmlFor="threeD_image"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      Drag & Drop your files or Browse
                    </label>
                  )}
                  <input
                    type="file"
                    name="threeD_image"
                    id="threeD_image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setThreeDImagePreview)}
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label
                  htmlFor="gallery_images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gallery Images
                </label>
                <div className="mt-1">
                  {galleryImagesPreview.length === 0 ? (
                    <label
                      htmlFor="gallery_images"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      Drag & Drop your files or Browse
                    </label>
                  ) : (
                    <div className="space-y-2">
                      {galleryImagesPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview.url}
                            alt={`Gallery ${index + 1} Preview`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removePreview(setGalleryImagesPreview, index)
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-500 mt-1">
                            ({preview.size})
                          </p>
                        </div>
                      ))}
                      <label
                        htmlFor="gallery_images"
                        className="block w-full text-center text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer mt-2"
                      >
                        + Add More Images
                      </label>
                    </div>
                  )}
                  <input
                    type="file"
                    name="gallery_images[]"
                    id="gallery_images"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e, setGalleryImagesPreview, true)
                    }
                  />
                </div>
              </div>

              {/* Video Link */}
              <div>
                <label
                  htmlFor="video_link"
                  className="block text-sm font-medium text-gray-700"
                >
                  Video Link
                </label>
                <input
                  type="text"
                  name="video_link"
                  id="video_link"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border border-transparent ${
                isSubmitting
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {isSubmitting ? "Adding Property..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </PageComponents>
  );
}
