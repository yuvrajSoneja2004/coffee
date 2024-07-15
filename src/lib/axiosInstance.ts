import { store } from "@/redux/store";
import axios from "axios";

// Create an instance of axios with default configuration
export const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const { sheetId } = store.getState().authSlice;
    // Check if it's a PUT or POST request
    if (config.method === "put" || config.method === "post") {
      // Fetching redux store state

      // Modify the request body to include spreadsheetId
      config.data = {
        ...config.data,
        spreadSheetId: sheetId,
      };
    }

    if (config.method === "get") {
      config.headers["X-SpreadSheetId"] = sheetId;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
