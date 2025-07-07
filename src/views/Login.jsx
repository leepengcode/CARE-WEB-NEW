import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIAJjvxXZ_jJxT_xxJmAb6LRPoRd3kb00",
  authDomain: "care-4b762.firebaseapp.com",
  projectId: "care-4b762",
  storageBucket: "care-4b762.firebasestorage.app",
  messagingSenderId: "722616287757",
  appId: "1:722616287757:web:dc90117345854269e68b44",
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.error("Firebase initialization failed:", err);
}
const auth = app ? getAuth(app) : null;

export default function Login() {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate phone: 8-10 digits, remove leading 0
    const cleanedPhone = phone.replace(/^0+/, "");
    if (!/^\d{8,10}$/.test(cleanedPhone)) {
      setError("Please enter a valid phone number (8-10 digits).");
      setLoading(false);
      return;
    }
    const fullPhone = "855" + cleanedPhone;

    // Generate email and password as per Flutter code
    const email = `${fullPhone}@realtyone.com`;
    const password = `!@@@@@@${fullPhone}@realtyone.com`;

    try {
      // Attempt to create a new user (will fail if user exists, which is fine)
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (createErr) {
        console.log(
          "User creation failed (expected if user exists):",
          createErr.message
        );
      }

      // Sign in with the email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseId = userCredential.user.uid;
      localStorage.setItem("firebaseUid", firebaseId);
      console.log("Firebase auth success: UID =", firebaseId);

      // Send phone number to backend to trigger OTP using authApi
      const res = await authApi.savePhone(fullPhone);
      if (res && res.error === 0) {
        navigate("/otp", { state: { phone: fullPhone, firebaseId } });
      } else {
        setError(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Firebase or backend error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4${
        i18n.language === "km" ? " khmer-font" : ""
      }`}
    >
      <div className="w-full  max-w-lg bg-white p-6 rounded-lg shadow-md flex flex-col items-start relative">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 text-start leading-tight mb-2">
          {t("login.enter_mobile")}
        </h2>
        <p className="text-blue-500 text-center mb-8 mt-2 text-base">
          {t("login.send_code")}
        </p>
        <form
          className="w-full flex flex-col items-start"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-start items-center mb-8 w-full">
            <span className="text-2xl md:text-3xl font-semibold text-black select-none">
              +855
            </span>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              autoComplete="tel"
              placeholder="69600400"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="ml-2 text-2xl md:text-3xl font-semibold bg-transparent border-none outline-none focus:ring-0 w-full max-w-[250px] text-start placeholder-gray-300"
              style={{ letterSpacing: "2px" }}
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-700 text-white text-lg font-semibold shadow-md hover:bg-blue-800 transition mb-6"
            disabled={loading}
          >
            {loading ? t("login.sending") : t("login.next")}
          </button>
        </form>
        <div className="w-full justify-center items-center">
          <p className="text-center text-sm text-blue-600 mt-2">
            {t("login.terms")} <br />
            <a href="/privacy" className="underline font-medium">
              {t("login.terms_link")} & {t("login.privacy_link")}
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
