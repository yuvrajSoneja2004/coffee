import { store } from "@/redux/store";
import axios from "axios";

// Create an instance of axios with default configuration
export const axiosInstance = axios.create();


// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    console.log("Interceptor called with method:", config.method);
    const { sheetId, subsheetsIds } = store.getState().authSlice;

    // Check if it's a PUT or POST request
    if(config.method === "post") {
      // Modify the request body to include spreadsheetId
      config.data = {
        ...config.data,
        spreadSheetId: sheetId,
      };

      
    }
    if(config.method === "put"){
      console.log("Inside put")
      console.log("YELP" , subsheetsIds[config.data?.sheetName])
      config.data = {
        ...config.data,
        spreadSheetId: sheetId,
        subSheetId: subsheetsIds[config.data?.sheetName]
      };
    }

    // For GET requests, add spreadSheetId to headers
    if (config.method === "get") {
      console.log(`sheetId inside GET: ${sheetId}`);
      
      // Create URLSearchParams object
      const searchParams = new URLSearchParams(config.params || {});
      
      // Add spreadSheetId to the search params
      searchParams.append('spreadSheetId', sheetId);
      
      // Update the config.params with the new URLSearchParams object
      config.params = searchParams;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);