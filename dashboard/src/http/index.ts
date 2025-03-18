import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../../config";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  baseURL: config.api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

axiosRetry(instance, { retries: 3 });

instance.interceptors.request.use((request) => {
  const accessToken = storage.get(config.name, "accessToken");
  if (!accessToken) {
    window.location.href =
      config.base === "/" ? "/login" : `${config.base}/login`;
  }
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

instance.interceptors.response.use(
  (response) => {
    const accessToken = storage.get(config.name, "accessToken");
    if (!accessToken) {
      window.location.href = "/login";
    }
    response.headers["Authorization"] = `Bearer ${accessToken}`;
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: `BAD REQUEST: ${JSON.stringify(error.response.data)}`,
          severity: "warning",
        });
      } else if (error.response.status >= 500) {
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: `SERVER ERROR: ${error.response.status}`,
          severity: "warning",
        });
      } else {
        console.error("API Error:", error.response.status, error.response.data);
      }
    } else {
      console.error("Network or unknown error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
