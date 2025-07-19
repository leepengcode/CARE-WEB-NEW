import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBell,
  FaCamera,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTelegramPlane,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageComponents from "../components/PageComponents.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { loadGoogleMaps } from "../utils/googleMapsLoader.js";

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
  const { t } = useTranslation();
  const { userToken, currentUser, setUserToken, setCurrentUser } =
    useStateContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    telegram_link: "",
    address: "",
    location: localStorage.getItem("userLocation") || "",
    notification: true,
    mobile: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // Load Google Maps API
  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setGoogleMapsReady(true);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps:", err);
        // Continue without Google Maps if it fails to load
        setGoogleMapsReady(true);
      });
  }, []);

  useEffect(() => {
    if (!userToken) {
      navigate("/");
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
            telegram_link: currentUser.telegram_link || "",
            address: currentUser.address || "",
            location: currentUser.location || "",
            notification:
              currentUser.notification !== undefined
                ? !!currentUser.notification
                : true,
            mobile: currentUser.mobile || "",
          });
          console.log("currentUser:", currentUser);
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
              telegram_link: res.data.data.telegram_link || "",
              address: res.data.data.address || "",
              location: res.data.data.location || "",
              notification:
                res.data.data.notification !== undefined
                  ? !!res.data.data.notification
                  : true,
              mobile: res.data.data.mobile || "",
            });
            console.log("profile from API:", res.data.data);
          } else {
            setError(res.data.message || t("profile_page.error"));
          }
        }
      } catch {
        setError(t("profile_page.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userToken, currentUser, navigate, t]);

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
        showToast(t("profile_page.profile_updated_success"), "success");
      } else {
        showToast(t("profile_page.profile_updated_error"), "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || t("profile_page.profile_update_failed"),
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
      <div class="mb-4 text-lg font-semibold text-gray-800">${t(
        "profile_page.sign_out_confirm"
      )}</div>
      <div class="flex gap-4">
        <button id="confirm-yes" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">${t(
          "profile_page.sign_out_yes"
        )}</button>
        <button id="confirm-no" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">${t(
          "profile_page.sign_out_no"
        )}</button>
      </div>
    `;
    document.body.appendChild(confirmDiv);
    document.getElementById("confirm-yes").onclick = () => {
      document.body.removeChild(confirmDiv);
      setUserToken(null);
      setCurrentUser({});
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      navigate("/");
      showToast(t("profile_page.signed_out_success"), "success");
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

  if (loading)
    return <div className="p-6 text-center">{t("profile_page.loading")}</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <PageComponents>
      {/* Hero Section */}
      <div className="w-full mt-5 md:mt-0 max-w-7xl mx-auto animate-fade-in-up md:px-10 md:pt-5">
        <div className="relative w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden mb-10 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaUserCircle className="text-blue-200 text-5xl md:text-7xl opacity-30" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
              {t("profile_page.title")}
            </h1>
            <p className="text-blue-800 text-base md:text-lg font-medium max-w-2xl mx-auto">
              {t("profile_page.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-0 px-2 md:px-10 animate-fade-in-up">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden md:flex border border-blue-100">
          {/* Left Column: Account Management */}
          <div className="md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-blue-100 flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <h2 className="text-lg font-semibold mb-6 text-blue-900 flex items-center gap-2">
              <FaUser className="text-blue-400" />{" "}
              {t("profile_page.account_management")}
            </h2>
            {/* Photo Upload */}
            <div className="relative mb-6">
              <div
                className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 cursor-pointer shadow-lg hover:scale-105 transition-all duration-200"
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
                  <FaUserCircle className="text-blue-300 w-20 h-20 md:w-28 md:h-28" />
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
                className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 border-2 border-white shadow hover:bg-blue-600 transition-all"
                onClick={handleAvatarClick}
                type="button"
                title={t("profile_page.change_photo")}
              >
                <FaCamera className="text-white text-lg" />
              </button>
            </div>
            <button
              onClick={handleAvatarClick}
              className="w-full px-4 py-2 border border-blue-200 rounded-md text-blue-700 text-sm hover:bg-blue-50 mb-6 font-semibold transition-all"
              type="button"
            >
              {t("profile_page.upload_photo")}
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2 shadow-md transition-all"
              type="button"
            >
              <FaSignOutAlt className="text-white" />{" "}
              {t("profile_page.sign_out")}
            </button>
          </div>

          {/* Right Column: Profile Information */}
          <div className="md:w-2/3 p-8">
            {/* Profile Information Section */}
            <h2 className="text-lg font-semibold mb-6 text-blue-900 flex items-center gap-2">
              <FaUser className="text-blue-400" />{" "}
              {t("profile_page.profile_information")}
            </h2>
            <form className="w-full space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {/* Username */}
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-blue-400 text-lg" />
                  <input
                    name="name"
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("profile_page.username_placeholder")}
                  />
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4 pt-6 border-t border-blue-100">
                <h3 className="text-md font-semibold text-blue-900 flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />{" "}
                  {t("profile_page.contact_info")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  {/* Phone Number (Read Only) */}
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-blue-400 text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25m-19.5 0l9 7.5 9-7.5"
                        />
                      </svg>
                    </span>
                    <input
                      name="mobile"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed opacity-70"
                      value={form?.mobile}
                      type="text"
                      readOnly
                      disabled
                    />
                  </div>
                  {/* Email */}
                  <div className="relative flex items-center">
                    <FaEnvelope className="absolute left-3 text-blue-400 text-lg" />
                    <input
                      name="email"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("profile_page.email_placeholder")}
                      type="email"
                    />
                  </div>
                  {/* Telegram */}
                  <div className="relative flex items-center">
                    <FaTelegramPlane className="absolute left-3 text-blue-400 text-lg" />
                    <input
                      name="telegram_link"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.telegram_link}
                      onChange={handleChange}
                      placeholder={t("profile_page.telegram_placeholder")}
                    />
                  </div>
                </div>
              </div>

              {/* About the User Section */}
              <div className="space-y-4 pt-6 border-t border-blue-100">
                <h3 className="text-md font-semibold text-blue-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-400" />{" "}
                  {t("profile_page.about_user")}
                </h3>
                {/* Address */}
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-3 text-blue-400 text-lg" />
                  <input
                    name="address"
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={form.address}
                    onChange={handleChange}
                    placeholder={t("profile_page.address_placeholder")}
                  />
                </div>
                {/* Location */}
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-3 text-blue-400 text-lg" />
                  {googleMapsReady ? (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      restrictions={{ country: "kh" }}
                      types={["(cities)"]}
                    >
                      <input
                        name="location"
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={form.location}
                        onChange={handleChange}
                        placeholder={t("profile_page.location_placeholder")}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      name="location"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md bg-blue-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={form.location}
                      onChange={handleChange}
                      placeholder={t("profile_page.location_placeholder")}
                    />
                  )}
                </div>

                {/* Notification Toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-blue-900 text-sm font-medium flex items-center gap-2">
                    <FaBell className="text-blue-400" />{" "}
                    {t("profile_page.notification")}
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-blue-500 text-sm">
                      {form.notification
                        ? t("profile_page.notification_enabled")
                        : t("profile_page.notification_disabled")}
                    </span>
                    <input
                      type="checkbox"
                      name="notification"
                      checked={form.notification}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 bg-blue-200 rounded-full shadow-inner transition-colors duration-200 ${
                        form.notification ? "bg-blue-500" : "bg-blue-200"
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
                className="w-full bg-blue-600 text-white py-3 rounded-full text-base font-semibold mt-4 shadow-lg hover:bg-blue-700 transition-all duration-200"
                disabled={updating}
              >
                {updating
                  ? t("profile_page.updating")
                  : t("profile_page.update_profile")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </PageComponents>
  );
}
