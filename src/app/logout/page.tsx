"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        // Clear local storage or perform any necessary logout actions
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect to the login page after logout
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }

    logout();
  }, []);

  // Return null to avoid rendering anything visible
  return null;
};

export default LogoutPage;
