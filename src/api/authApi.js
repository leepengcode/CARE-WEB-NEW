import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Authentication API calls
export const authApi = {
  // Send phone number to trigger OTP
  savePhone: async (phone) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/save-phone-list`,
      { phone }
    );
    return response.data;
  },

  // User signup/registration
  userSignup: async (firebaseId, mobile, type = "1") => {
    const response = await axios.post(
      `${API_BASE_URL}/api/user_signup`,
      {
        firebase_id: firebaseId,
        type,
        mobile,
      }
    );
    return response.data;
  },

  // Get user profile by ID
  getUserById: async (token, userId) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/get_user_by_id`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { userid: userId },
      }
    );
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (phone, otp) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/check-otp`,
      { phone, otp }
    );
    return response.data;
  },

  // Complete user registration with profile data
  completeRegistration: async (token, userData) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/complete_registration`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Logout user
  logout: async (token) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (token) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

export default authApi; 