import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageComponents from "../components/PageComponents.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";

function showToast(message, type = "info") {
  // Simple toast implementation
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed left-1/2 top-8 z-50 px-6 py-3 rounded shadow text-white text-center transition-all duration-300 ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600"
  }`;
  toast.style.transform = "translateX(-50%)";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => document.body.removeChild(toast), 400);
  }, 2000);
}

export default function Profile() {
  const { userToken, currentUser, setUserToken, setCurrentUser } =
    useStateContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    telegram_link: "",
    address: "",
    location: localStorage.getItem("userLocation") || "",
    notification: true,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        if (currentUser && currentUser.id) {
          setProfile(currentUser);
          setForm({
            name: currentUser.name || "",
            email: currentUser.email || "",
            mobile: currentUser.mobile || "",
            telegram_link: currentUser.telegram_link || "",
            address: currentUser.address || "",
            location: currentUser.location || "",
            notification:
              currentUser.notification !== undefined
                ? !!currentUser.notification
                : true,
          });
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/get_user_by_id`,
            {
              headers: { Authorization: `Bearer ${userToken}` },
              params: { userid: currentUser?.id },
            }
          );
          if (!res.data.error && res.data.data) {
            setProfile(res.data.data);
            setForm({
              name: res.data.data.name || "",
              email: res.data.data.email || "",
              mobile: res.data.data.mobile || "",
              telegram_link: res.data.data.telegram_link || "",
              address: res.data.data.address || "",
              location: res.data.data.location || "",
              notification:
                res.data.data.notification !== undefined
                  ? !!res.data.data.notification
                  : true,
            });
          } else {
            setError(res.data.message || "Failed to load profile");
          }
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userToken, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id && !currentUser?.id) return;
    setUpdating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("userid", profile?.id || currentUser?.id);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append("telegram_link", form.telegram_link);
      formData.append("address", form.address);
      formData.append("notification", form.notification ? 1 : 0);
      if (avatarFile) {
        formData.append("profile", avatarFile);
      }
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update_profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Fetch the updated profile from backend
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get_user_by_id`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
          params: { userid: profile?.id || currentUser?.id },
        }
      );
      if (!res.data.error && res.data.data) {
        const updatedUser = {
          ...res.data.data,
          location: form.location,
        };
        setProfile(updatedUser);
        setCurrentUser(updatedUser);
        setAvatarFile(null);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Profile updated, but failed to refresh info.", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile!",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    // Show toast confirmation
    const confirmDiv = document.createElement("div");
    confirmDiv.className =
      "fixed left-1/2 top-1/3 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center";
    confirmDiv.style.transform = "translateX(-50%)";
    confirmDiv.innerHTML = `
      <div class="mb-4 text-lg font-semibold text-gray-800">Are you sure you want to sign out?</div>
      <div class="flex gap-4">
        <button id="confirm-yes" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes</button>
        <button id="confirm-no" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">No</button>
      </div>
    `;
    document.body.appendChild(confirmDiv);
    document.getElementById("confirm-yes").onclick = () => {
      document.body.removeChild(confirmDiv);
      setUserToken(null);
      setCurrentUser({});
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      navigate("/login");
      showToast("Signed out successfully!", "success");
    };
    document.getElementById("confirm-no").onclick = () => {
      document.body.removeChild(confirmDiv);
    };
  };

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      // Only get the city name from the address components
      const cityComponent = place.address_components?.find((component) =>
        component.types.includes("locality")
      );

      if (cityComponent) {
        const cityName = cityComponent.long_name;
        setForm((prev) => ({
          ...prev,
          location: cityName,
        }));
        // Store location in localStorage
        localStorage.setItem("userLocation", cityName);
        // Update currentUser context with new location
        setCurrentUser((prev) => ({
          ...prev,
          location: cityName,
        }));
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden md:flex">
          {/* Left Column: Account Management */}
          <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Account Management
            </h2>
            {/* Photo Upload */}
            <div className="relative mb-6">
              <div
                className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 cursor-pointer"
                onClick={handleAvatarClick}
              >
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile?.profile ? (
                  <img
                    src={`${profile.profile}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-blue-400 w-16 h-16"
                  >
                    <circle cx="12" cy="8" r="4" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"
                    />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <button
                className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-2 border-white shadow"
                onClick={handleAvatarClick}
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 000-1.414l-3.586-3.586a1 1 0 00-1.414 0L3 17z"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={handleAvatarClick}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 mb-6"
              type="button"
            >
              Upload Photo
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
              type="button"
            >
              Sign Out
            </button>
          </div>

          {/* Right Column: Profile Information */}
          <div className="md:w-2/3 p-6">
            {/* Profile Information Section */}
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Profile Information
            </h2>
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {/* Username */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Username
                  </label>
                  {/* Mapping 'name' to Username based on current code structure */}
                  <input
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Username"
                  />
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900">
                  Contact Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email (required)
                    </label>
                    <input
                      name="email"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  {/* Telegram */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Telegram
                    </label>
                    <input
                      name="telegram_link"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.telegram_link}
                      onChange={handleChange}
                      placeholder="Telegram Link"
                    />
                  </div>
                </div>
              </div>

              {/* About the User Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900">
                  About the User
                </h3>
                {/* Address */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Select Location
                  </label>
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    restrictions={{ country: "kh" }}
                    types={["(cities)"]}
                  >
                    <input
                      name="location"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Search for a city"
                    />
                  </Autocomplete>
                </div>

                {/* Notification Toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700 text-sm font-medium">
                    Notification
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-gray-500 text-sm">
                      {form.notification ? "Enabled" : "Disabled"}
                    </span>
                    <input
                      type="checkbox"
                      name="notification"
                      checked={form.notification}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-200 ${
                        form.notification ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${
                          form.notification ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold mt-4 shadow-md hover:bg-blue-700 transition"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageComponents>
  );
}
