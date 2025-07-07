import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function OtpVerify() {
  const { state } = useLocation();
  const phone = state?.phone || "";
  const firebaseId =
    state?.firebaseId || localStorage.getItem("firebaseUid") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(110);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) {
      inputs.current[i + 1].focus();
    }
    setError("");
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      setError("Please enter the full OTP code.");
      return;
    }
    setLoading(true);
    setError("");
    const otpCode = otp.join("");

    try {
      console.log("Checking OTP...");
      const otpRes = await authApi.verifyOtp(phone, otpCode);
      if (otpRes && otpRes.error === 0) {
        console.log("OTP verification success:", otpRes);
        navigate("/signup", { state: { phone, firebaseId } });
      } else {
        setError(otpRes.message || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (err.response) {
        setError(
          err.response.data?.message || "Server error. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(110);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    try {
      console.log("Resending OTP...");
      const res = await authApi.savePhone(phone);
      if (res && res.error !== 0) {
        setError(res.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(
        err.response?.data?.message || "Network error. Please try again."
      );
    }
  };

  const timerStr = `${Math.floor(timer / 60)}:${(timer % 60)
    .toString()
    .padStart(2, "0")}Sec`;

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4${
        i18n.language === "km" ? " khmer-font" : ""
      }`}
    >
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col items-start relative">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 text-start leading-tight mb-2">
          {t("otp.title")}
        </h2>
        <p className="text-blue-500 text-base mb-8 mt-2">
          {t("otp.enter_code", { phone })}
        </p>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center gap-3 mb-6 w-full">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-3xl text-center border-b-2 border-gray-300 focus:border-blue-600 outline-none transition"
                style={{ fontFamily: "monospace" }}
                autoFocus={i === 0}
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="mb-6 text-blue-600 text-sm">
            {timer > 0 ? (
              <>
                {t("otp.resend_in")}{" "}
                <span className="font-semibold">{timerStr}</span>
              </>
            ) : (
              <button
                type="button"
                className="underline font-medium"
                onClick={handleResend}
              >
                {t("otp.resend_code")}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-700 text-white text-lg font-semibold shadow-md hover:bg-blue-800 transition"
            disabled={loading}
          >
            {loading ? t("otp.verifying") : t("otp.confirm")}
          </button>
        </form>
      </div>
    </div>
  );
}
