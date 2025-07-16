import { useEffect, useState } from "react";

export function useUserRole(userToken, currentUser) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userToken || !currentUser?.id) return;
      try {
        const userResponse = await fetch(
          `https://externalchecking.com/api/api_rone_new/public/api/get_user_by_id?userid=${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const userData = await userResponse.json();
        if (!userData.error) {
          setUserRole(userData.data.role);
        }
      } catch {
        // Optionally handle error
      }
    };
    fetchUserRole();
  }, [userToken, currentUser]);

  return userRole;
} 