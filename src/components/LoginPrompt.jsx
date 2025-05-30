import React from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginPrompt = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <FaSignInAlt className="text-blue-600 mb-4" size={48} />
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Please login to access this page
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors text-lg font-medium"
        >
          <FaSignInAlt className="w-6 h-6" />
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
