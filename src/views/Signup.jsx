import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
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
        const data = await authApi.userSignup(firebaseId, phone, "1");

        if (!isMounted) return;

        if (!data.error && data.token) {
          const token = data.token;
          setUserToken(token);

          // Get user profile using the token
          const profileRes = await authApi.getUserById(token, data.data.id);

          if (!profileRes.error && profileRes.data) {
            setCurrentUser(profileRes.data);
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

  if (authLoading) return <div className="p-6 text-center"></div>;
  if (!showForm) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4"></div>
  );
}
