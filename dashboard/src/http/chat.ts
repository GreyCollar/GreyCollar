import axios from "axios";
import config from "../../config";
import { storage } from "@nucleoidjs/webstorage";
const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
    Authorization: `Bearer ${storage.get(config.name, "accessToken")}`,
  },
});

axios.interceptors.request.use((request) => {
  return request;
});

axios.interceptors.response.use((response) => {
  return response;
});

export default instance;
