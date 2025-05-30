import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Signup() {
  const { state } = useLocation();
  const phone = state?.phone || "";
  const firebaseId =
    state?.firebaseId || localStorage.getItem("firebaseUid") || "";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telegramLink: "",
    address: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { setUserToken, setCurrentUser } = useStateContext();
  const navigate = useNavigate();

  const locationOptions = [
    "Phnom Penh",
    "Siem Reap",
    "Battambang",
    "Sihanoukville",
    "Kampong Cham",
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkUserExists = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user_signup`,
          {
            firebase_id: firebaseId,
            type: "phone",
            mobile: phone,
          },
          { signal: controller.signal }
        );

        if (!isMounted) return;

        if (!data.error && data.token) {
          const token = data.token;
          setUserToken(token);

          // Get user profile using the token
          const profileRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/get_user_by_id`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { userid: data.data.id },
              signal: controller.signal,
            }
          );

          if (!profileRes.data.error && profileRes.data.data) {
            setCurrentUser(profileRes.data.data);
            navigate("/");
          } else {
            setShowForm(true);
          }
        } else {
          setShowForm(true);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error checking user:", err);
        if (err.response?.status === 404) {
          setShowForm(true);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    if (firebaseId) checkUserExists();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [firebaseId, phone, navigate, setUserToken, setCurrentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { fullName, email, telegramLink, address, location } = formData;
    if (!fullName || !email || !telegramLink || !address || !location) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user_signup`,
        {
          firebase_id: firebaseId,
          type: "phone",
          name: fullName,
          email,
          mobile: phone,
          telegram_link: telegramLink,
          address,
          location,
        }
      );

      if (!data.error && data.token) {
        setUserToken(data.token);

        // Get user profile using the token
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/get_user_by_id`,
          {
            headers: { Authorization: `Bearer ${data.token}` },
            params: { userid: data.data.id },
          }
        );

        if (!profileRes.data.error && profileRes.data.data) {
          setCurrentUser(profileRes.data.data);
          navigate("/");
        } else {
          setError("Failed to fetch user profile. Please try again.");
        }
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return <div className="p-6 text-center">Checking user...</div>;
  if (!showForm) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your details to finish signing up
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="telegramLink"
            placeholder="Telegram Link"
            className="w-full p-2 border rounded"
            value={formData.telegramLink}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            className="w-full p-2 border rounded"
            value={formData.address}
            onChange={handleChange}
          />
          <select
            name="location"
            className="w-full p-2 border rounded"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="">Select Location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <input
            disabled
            value={`+${phone}`}
            className="w-full p-2 border rounded bg-gray-100"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Complete Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
