import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://sonic.bantuit.my.id",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

