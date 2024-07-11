import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { storeAuthInfo } from "../redux/features/authSlice";

interface Props {
  children: React.ReactNode;
}

const CheckAuth: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentPathName = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Function to handle redirection based on authentication status
    const handleRedirection = async () => {
      if (!token || currentPathName === "/auth/signin") {
        setLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          dispatch(
            storeAuthInfo({
              name: decodedToken?.name,
              role: decodedToken?.role,
            }),
          );
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          router.push("/auth/signin");
          setLoading(false); // Ensure setLoading is called after router.push
        }
      } catch (error) {
        console.error("Invalid token:", error);
        router.push("/auth/signin");
        setLoading(false); // Ensure setLoading is called after router.push
      }
    };

    handleRedirection(); // Initial check

    // Clean up function to prevent memory leaks
    return () => setLoading(false); // Ensures component unmounts properly
  }, [router, currentPathName]);

  // If still loading, show loading message
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading indicator
  }

  // If not authenticated and not on signin page, redirect to signin
  if (!isAuthenticated && currentPathName !== "/auth/signin") {
    router.push("/auth/signin");
    return null; // Optional: You can return null or loading indicator until redirection happens
  }

  // If not authenticated and on signin page, show children (e.g., signin form)
  if (!isAuthenticated && currentPathName === "/auth/signin") {
    return <>{children}</>;
  }

  // If authenticated, show children (application content)
  return <>{children}</>;
};

export default CheckAuth;
