import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const userApi = {
  // Update user profile
  updateProfile: async (token, userData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/update_profile`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/get_profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Change password
  changePassword: async (token, passwordData) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/change_password`,
      passwordData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (token, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/upload_profile_image`,
      formData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default userApi; 