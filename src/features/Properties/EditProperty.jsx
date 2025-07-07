import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAddress, fetchPropertyForEdit } from "../../api/propertyApi";
import PageComponents from "../../components/PageComponents";
import CustomDropdown from "../../components/shared/CustomDropdown";
import { useStateContext } from "../../contexts/ContextProvider";

// Define libraries as a static constant outside the component
const googleMapLibraries = ["places"];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, currentUser } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [facilities, setFacilities] = useState({});
  const [propertyType, setPropertyType] = useState(null);
  const [rentDurationType, setRentDurationType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("KH");
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 11.5564, lng: 104.9282 });
  const [markerPosition, setMarkerPosition] = useState({
    lat: 11.5564,
    lng: 104.9282,
  });
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [threeDImagePreview, setThreeDImagePreview] = useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);

  // State for location options
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);

  // Add state for categories
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [propertyData, setPropertyData] = useState(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: googleMapLibraries,
  });

  const { t } = useTranslation();

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

  // Add function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/get_categories",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.message);

      // Transform the data to match the dropdown format
      const formattedCategories = data.data.map((category) => ({
        value: category.id.toString(),
        label: category.category,
      }));

      // Add the default "Select Category" option
      setCategoryOptions([
        { value: "", label: "Select Category" },
        ...formattedCategories,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add useEffect to fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [userToken]);

  // Handle facility changes
  const handleFacilityChange = (facilityId, checked) => {
    setFacilities((prev) => ({
      ...prev,
      [facilityId]: checked
        ? { facility_id: facilityId, distance: "" }
        : undefined,
    }));
  };

  // Handle distance changes
  const handleDistanceChange = (facilityId, distance) => {
    setFacilities((prev) => ({
      ...prev,
      [facilityId]: { ...prev[facilityId], distance },
    }));
  };

  // Handle file changes
  const handleFileChange = (e, setter, isMultiple = false) => {
    const files = e.target.files;
    if (!files.length) return;

    if (isMultiple) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setter((prev) => [...prev, ...newFiles]);
    } else {
      const file = files[0];
      setter({ file, url: URL.createObjectURL(file) });
    }
  };

  // Remove preview
  const removePreview = (setter, index) => {
    if (typeof index === "number") {
      setter((prev) => prev.filter((_, i) => i !== index));
    } else {
      setter(null);
    }
  };

  // Add function to fetch parameters by category
  const fetchParametersByCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `https://externalchecking.com/api/api_rone_new/public/api/get_parameters_by_category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.message);
      setParameters(data.data || []);
    } catch (error) {
      console.error("Error fetching parameters:", error);
    }
  };

  // Add useEffect to fetch parameters when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchParametersByCategory(selectedCategory);
    }
  }, [selectedCategory, userToken]);

  // Update renderParameterInput function to fix lexical declaration error
  const renderParameterInput = (param) => {
    let options = [];
    if (param.type_of_parameter === "dropdown") {
      options = Array.isArray(param.type_values)
        ? param.type_values
        : JSON.parse(param.type_values || "[]");
    }

    switch (param.type_of_parameter) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            id={`parameter_${param.id}`}
            checked={parameterValues[param.id] === "1"}
            onChange={(e) =>
              setParameterValues((prev) => ({
                ...prev,
                [param.id]: e.target.checked ? "1" : "0",
              }))
            }
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues((prev) => ({
                ...prev,
                [param.id]: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case "dropdown":
        return (
          <select
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues((prev) => ({
                ...prev,
                [param.id]: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select {param.name}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            id={`parameter_${param.id}`}
            value={parameterValues[param.id] || ""}
            onChange={(e) =>
              setParameterValues((prev) => ({
                ...prev,
                [param.id]: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
    }
  };

  // Add function to fetch facilities
  const fetchFacilities = async () => {
    try {
      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/get_facilities",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.message);
      setFacilityOptions(data.data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  // Add useEffect to fetch facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, [userToken]);

  // Fetch property data
  const fetchPropertyData = useCallback(async () => {
    try {
      setLoading(true);
      const propertyResponse = await fetchPropertyForEdit(
        id,
        userToken,
        currentUser?.role || "researcher",
        currentUser?.id
      );

      console.log("API Response:", propertyResponse);

      // Check if response exists
      if (!propertyResponse) {
        throw new Error("No response from server");
      }

      // The response is the property data directly
      const propertyData = propertyResponse;
      setPropertyData(propertyData);
      console.log("Property Data:", propertyData);
      console.log("Current User:", currentUser);

      // Check if user is authorized to edit this property
      if (propertyData.customer_name !== currentUser?.name) {
        console.log("Authorization check failed:", {
          propertyCustomerName: propertyData.customer_name,
          currentUserName: currentUser?.name,
        });
        throw new Error("You are not authorized to edit this property");
      }

      // Set all the form data from the property
      setPropertyType(propertyData.propery_type === "Sell" ? "1" : "2");
      setSelectedCategory(
        propertyData.category?.id ? propertyData.category.id.toString() : ""
      );
      setRentDurationType(propertyData.rentduration || "");

      // Set map coordinates
      const lat = parseFloat(propertyData.latitude) || 11.5564;
      const lng = parseFloat(propertyData.longitude) || 104.9282;
      setLatitude(propertyData.latitude || "");
      setLongitude(propertyData.longitude || "");
      setCenter({ lat, lng });
      setMarkerPosition({ lat, lng });

      // Fetch and set address data
      try {
        // Fetch provinces
        const provinces = await fetchAddress("855", ["province"]);
        setProvinceOptions(provinces);

        if (propertyData.province?.code) {
          setSelectedProvince(propertyData.province.code);

          // Fetch districts for the selected province
          const districts = await fetchAddress(propertyData.province.code, [
            "district",
            "khan",
          ]);
          setDistrictOptions(districts);

          if (propertyData.district?.code) {
            setSelectedDistrict(propertyData.district.code);

            // Fetch communes for the selected district
            const communes = await fetchAddress(propertyData.district.code, [
              "commune",
              "sangkat",
            ]);
            setCommuneOptions(communes);

            if (propertyData.commune?.code) {
              setSelectedCommune(propertyData.commune.code);

              // Fetch villages for the selected commune
              const villages = await fetchAddress(propertyData.commune.code, [
                "village",
              ]);
              setVillageOptions(villages);
              setSelectedVillage(propertyData.village?.code || "");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }

      // Set facilities
      const facilitiesMap = {};
      if (
        propertyData.assign_facilities &&
        Array.isArray(propertyData.assign_facilities)
      ) {
        propertyData.assign_facilities.forEach((facility) => {
          facilitiesMap[facility.facility_id] = {
            facility_id: facility.facility_id,
            distance: facility.distance,
            name: facility.name,
            image: facility.image,
          };
        });
      }
      setFacilities(facilitiesMap);

      // Set parameters
      if (propertyData.parameters && Array.isArray(propertyData.parameters)) {
        const paramsMap = {};
        propertyData.parameters.forEach((param) => {
          paramsMap[param.id] = param.value;
        });
        setParameterValues(paramsMap);
        setParameters(propertyData.parameters);
      }

      // Set images
      if (propertyData.title_image) {
        setTitleImagePreview({ url: propertyData.title_image });
      }
      if (propertyData.threeD_image) {
        setThreeDImagePreview({ url: propertyData.threeD_image });
      }
      if (propertyData.gallery) {
        setGalleryImagesPreview(
          propertyData.gallery.map((img) => ({ url: img.image_url }))
        );
      }

      // Set form values
      const form = document.querySelector("form");
      if (form) {
        form.title.value = propertyData.title || "";
        form.description.value = propertyData.description || "";
        form.price.value = propertyData.price || "";
        form.client_address.value = propertyData.client_address || "";
        form.address.value = propertyData.address || "";
        form.owner_name.value = propertyData.owner_name || "";
        form.owner_phone.value = propertyData.owner_phone || "";
        form.owner_address.value = propertyData.owner_address || "";
        form.owner_note.value = propertyData.owner_note || "";
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setError(err.message || "Failed to fetch property data");
    } finally {
      setLoading(false);
    }
  }, [id, userToken, currentUser]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  // Add this useEffect after categoryOptions and propertyData are defined
  useEffect(() => {
    if (
      categoryOptions.length > 0 &&
      propertyData &&
      propertyData.category?.id &&
      selectedCategory !== propertyData.category.id.toString()
    ) {
      setSelectedCategory(propertyData.category.id.toString());
    }
  }, [categoryOptions, propertyData]);

  // Add debug logs for category dropdown
  useEffect(() => {
    console.log("selectedCategory:", selectedCategory);
    console.log("categoryOptions:", categoryOptions);
    console.log("propertyData?.category?.id:", propertyData?.category?.id);
  }, [selectedCategory, categoryOptions, propertyData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    // Validation for required fields
    console.log("Required fields before submit:", {
      id,
      action_type: 0,
      category_id: selectedCategory,
      title: e.target.title.value,
      description: e.target.description.value,
      propertyType,
      price: e.target.price.value,
      latitude,
      longitude,
      selectedCountry,
      selectedProvince,
      selectedDistrict,
      selectedCommune,
      selectedVillage,
      client_address: e.target.client_address.value,
      owner_name: e.target.owner_name.value,
      owner_phone: e.target.owner_phone.value,
      owner_address: e.target.owner_address.value,
    });
    const missingFields = [];
    if (!selectedCategory) missingFields.push("Category");
    if (!e.target.title.value) missingFields.push("Title");
    if (!e.target.description.value) missingFields.push("Description");
    if (!propertyType) missingFields.push("Property Type");
    if (!e.target.price.value) missingFields.push("Price");
    if (!latitude) missingFields.push("Latitude");
    if (!longitude) missingFields.push("Longitude");
    if (!selectedCountry) missingFields.push("Country");
    if (!selectedProvince) missingFields.push("Province");
    if (!selectedDistrict) missingFields.push("District");
    if (!selectedCommune) missingFields.push("Commune");
    if (!selectedVillage) missingFields.push("Village");
    if (!e.target.client_address.value) missingFields.push("Client Address");
    if (!e.target.owner_name.value) missingFields.push("Owner Name");
    if (!e.target.owner_phone.value) missingFields.push("Owner Phone");
    if (!e.target.owner_address.value) missingFields.push("Owner Address");

    if (missingFields.length > 0) {
      setFormError("Please fill all data and Submit");
      console.error("Missing required fields:", missingFields);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Required fields
      formData.append("property_id", id);
      formData.append("category_id", selectedCategory);
      formData.append("userid", currentUser.id);

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
      formData.append("owner_name", e.target.owner_name.value || "");
      formData.append("owner_phone", e.target.owner_phone.value || "");
      formData.append("owner_address", e.target.owner_address.value || "");
      formData.append("owner_note", e.target.owner_note.value || "");

      // Images
      if (titleImagePreview && titleImagePreview.file) {
        formData.append("title_image", titleImagePreview.file);
      }
      if (threeDImagePreview && threeDImagePreview.file) {
        formData.append("three_d_image", threeDImagePreview.file);
      }
      if (galleryImagesPreview.length > 0) {
        galleryImagesPreview.forEach((image, index) => {
          if (image.file) {
            formData.append(`gallery[${index}]`, image.file);
          }
        });
      }

      // Facilities
      Object.entries(facilities).forEach(([facilityId, data]) => {
        if (data) {
          formData.append(`facilities[${facilityId}]`, data.distance);
        }
      });

      // Parameters
      Object.entries(parameterValues).forEach(([paramId, value]) => {
        if (value) {
          formData.append(`parameters[${paramId}]`, value);
        }
      });

      // Log all FormData entries before sending
      console.log("FormData before update:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/update_post_property",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("Failed to parse JSON:", responseText);
        throw new Error("Server returned an invalid JSON response.");
      }

      if (result.error) {
        throw new Error(result.message || "Failed to update property");
      }

      // Show success message and redirect
      alert("Property updated successfully!");
      navigate(`/property/${id}`);
    } catch (err) {
      console.error("Update property error:", err);
      setError(err.message);
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-2 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
            >
              <FaChevronLeft className="w-4 h-4" />
              <span className="text-base">{t("edit_property_page.back")}</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PageComponents>
    );
  }

  if (error) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-2 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
            >
              <FaChevronLeft className="w-4 h-4" />
              <span className="text-base">{t("edit_property_page.back")}</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-red-600 text-center">
              <h2 className="text-xl font-semibold mb-2">
                {t("edit_property_page.error")}
              </h2>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="text-base">{t("edit_property_page.back")}</span>
          </button>
        </div>

        <h1 className="text-2xl font-semibold mb-6">
          {t("edit_property_page.title")}
        </h1>

        {formError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Owner Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("edit_property_page.owner_section")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="owner_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("edit_property_page.name_label")}
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
                  {t("edit_property_page.phone_label")}
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
                  {t("edit_property_page.address_label")}
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
                  {t("edit_property_page.note_label")}
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
              <h2 className="text-xl font-semibold mb-4">
                {t("edit_property_page.details_section")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("edit_property_page.category_label")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    options={categoryOptions}
                    value={
                      categoryOptions.find(
                        (opt) => opt.value === selectedCategory
                      ) || categoryOptions[0]
                    }
                    onChange={(option) => setSelectedCategory(option.value)}
                    placeholder={t(
                      "edit_property_page.select_category_placeholder"
                    )}
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("edit_property_page.title_label")}{" "}
                    <span className="text-red-500">*</span>
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
                    {t("edit_property_page.property_type_label")}{" "}
                    <span className="text-red-500">*</span>
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
                      <span className="ml-2">
                        {t("edit_property_page.for_sell")}
                      </span>
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
                      <span className="ml-2">
                        {t("edit_property_page.for_rent")}
                      </span>
                    </label>
                  </div>
                </div>
                {propertyType === "2" && (
                  <div>
                    <label
                      htmlFor="rentdurationtype"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.duration_label")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      options={[
                        {
                          value: "",
                          label: t("edit_property_page.select_placeholder"),
                        },
                        {
                          value: "Daily",
                          label: t("edit_property_page.daily"),
                        },
                        {
                          value: "Monthly",
                          label: t("edit_property_page.monthly"),
                        },
                        {
                          value: "Yearly",
                          label: t("edit_property_page.yearly"),
                        },
                      ]}
                      value={{
                        value: rentDurationType,
                        label: rentDurationType
                          ? t(
                              `edit_property_page.${rentDurationType.toLowerCase()}`
                            )
                          : t("edit_property_page.select_placeholder"),
                      }}
                      onChange={(option) => setRentDurationType(option.value)}
                      placeholder={t(
                        "edit_property_page.select_duration_placeholder"
                      )}
                    />
                  </div>
                )}
                {(propertyType === "1" || propertyType === "2") && (
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.price_label")}
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
              <h2 className="text-xl font-semibold mb-4">
                {t("edit_property_page.description_label")}
              </h2>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("edit_property_page.description_label")}{" "}
                  <span className="text-red-500">*</span>
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
            <h2 className="text-xl font-semibold mb-4">
              {t("edit_property_page.nearby_places_section")}
            </h2>
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
                        {t("edit_property_page.distance_label")}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        name={`facilities[${facility.id}].distance`}
                        id={`distance_${facility.id}`}
                        placeholder={t(
                          "edit_property_page.distance_placeholder"
                        )}
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

          {/* Facilities Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("edit_property_page.facilities_section")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {parameters.map((param) => (
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
            <h2 className="text-xl font-semibold mb-4">
              {t("edit_property_page.location_section")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Map */}
              <div className="md:col-span-1">
                <div className="md:col-span-1">
                  {loadError ? (
                    <div className="text-red-500">
                      {t("edit_property_page.map_loading_error")}
                    </div>
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
                          placeholder={t("edit_property_page.map_placeholder")}
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

              {/* Location Details */}
              <div className="md:col-span-1 grid grid-cols-1 gap-4 mt-10">
                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("edit_property_page.country_label")}
                  </label>
                  <CustomDropdown
                    options={[{ value: "KH", label: t("countries.cambodia") }]}
                    value={{
                      value: selectedCountry,
                      label: t("countries.cambodia"),
                    }}
                    onChange={(option) => setSelectedCountry(option.value)}
                    placeholder={t(
                      "edit_property_page.select_country_placeholder"
                    )}
                  />
                </div>
                {/* Province and District */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.province_label")}
                    </label>
                    <CustomDropdown
                      options={provinceOptions}
                      value={{
                        value: selectedProvince,
                        label:
                          provinceOptions.find(
                            (opt) => opt.value === selectedProvince
                          )?.label ||
                          t("edit_property_page.select_province_placeholder"),
                      }}
                      onChange={(option) => setSelectedProvince(option.value)}
                      placeholder={t(
                        "edit_property_page.select_province_placeholder"
                      )}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.district_label")}
                    </label>
                    <CustomDropdown
                      options={districtOptions}
                      value={{
                        value: selectedDistrict,
                        label:
                          districtOptions.find(
                            (opt) => opt.value === selectedDistrict
                          )?.label ||
                          t("edit_property_page.select_district_placeholder"),
                      }}
                      onChange={(option) => setSelectedDistrict(option.value)}
                      placeholder={t(
                        "edit_property_page.select_district_placeholder"
                      )}
                      isDisabled={!selectedProvince}
                    />
                  </div>
                </div>
                {/* Commune and Village */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="commune"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.commune_label")}
                    </label>
                    <CustomDropdown
                      options={communeOptions}
                      value={{
                        value: selectedCommune,
                        label:
                          communeOptions.find(
                            (opt) => opt.value === selectedCommune
                          )?.label ||
                          t("edit_property_page.select_commune_placeholder"),
                      }}
                      onChange={(option) => setSelectedCommune(option.value)}
                      placeholder={t(
                        "edit_property_page.select_commune_placeholder"
                      )}
                      isDisabled={!selectedDistrict}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="village"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("edit_property_page.village_label")}
                    </label>
                    <CustomDropdown
                      options={villageOptions}
                      value={{
                        value: selectedVillage,
                        label:
                          villageOptions.find(
                            (opt) => opt.value === selectedVillage
                          )?.label ||
                          t("edit_property_page.select_village_placeholder"),
                      }}
                      onChange={(option) => setSelectedVillage(option.value)}
                      placeholder={t(
                        "edit_property_page.select_village_placeholder"
                      )}
                      isDisabled={!selectedCommune}
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
                      {t("edit_property_page.latitude_label")}{" "}
                      <span className="text-red-500">*</span>
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
                      {t("edit_property_page.longitude_label")}{" "}
                      <span className="text-red-500">*</span>
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
                    {t("edit_property_page.client_address_label")}{" "}
                    <span className="text-red-500">*</span>
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
                    {t("edit_property_page.address_label")}
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
            <h2 className="text-xl font-semibold mb-4">
              {t("edit_property_page.images_section")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Title Image */}
              <div>
                <label
                  htmlFor="title_image"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("edit_property_page.title_image_label")}
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
                    </div>
                  ) : (
                    <label
                      htmlFor="title_image"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      {t("edit_property_page.dnd_placeholder")}
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
                  {t("edit_property_page.threeD_image_label")}
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
                    </div>
                  ) : (
                    <label
                      htmlFor="threeD_image"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      {t("edit_property_page.dnd_placeholder")}
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
                  {t("edit_property_page.gallery_images_label")}
                </label>
                <div className="mt-1">
                  {galleryImagesPreview.length === 0 ? (
                    <label
                      htmlFor="gallery_images"
                      className="block w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center pt-12 text-gray-500 hover:bg-gray-200 cursor-pointer"
                    >
                      {t("edit_property_page.dnd_placeholder")}
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
                        </div>
                      ))}
                      <label
                        htmlFor="gallery_images"
                        className="block w-full text-center text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer mt-2"
                      >
                        {t("edit_property_page.add_more_images")}
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
                  {t("edit_property_page.video_link_label")}
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
              {isSubmitting
                ? t("edit_property_page.submitting_button")
                : t("edit_property_page.submit_button")}
            </button>
          </div>
        </form>
      </div>
    </PageComponents>
  );
};

export default EditProperty;
