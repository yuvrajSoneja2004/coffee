"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ReduxProvider } from "@/redux/features/provider";
import { Toaster } from "@/components/ui/toaster";
import CheckAuth from "@/wrappers/checkAuth";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  //   router.push("/auth/signin"); // This will immediately redirect, ensure this is intended
  // }, []);

  return (
    <html>
      <body>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <ReduxProvider>
            <CheckAuth>{children}</CheckAuth>
          </ReduxProvider>

          <Toaster />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
