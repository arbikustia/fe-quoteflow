import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://sonic.bantuit.my.id",
  headers: {
    "Content-Type": "application/json",
  },
});

const MASTER_ACTIVITY_CONFIG: { endpoint: string; page: string }[] = [
  { endpoint: "/api/customer", page: "customer" },
  { endpoint: "/api/category", page: "category" },
  { endpoint: "/api/item", page: "item" },
  { endpoint: "/api/project", page: "project" },
  { endpoint: "/api/payment-method", page: "payment method" },
  { endpoint: "/api/payment-type", page: "payment type" },
  { endpoint: "/api/voucher", page: "voucher" },
  { endpoint: "/api/role", page: "role" },
  { endpoint: "/api/users", page: "user" },
  { endpoint: "/api/pic", page: "PIC" },
  { endpoint: "/api/service-type", page: "service type" },
  { endpoint: "/api/email-sender", page: "email sender" },
];

type MasterActivityBody = {
  name?: string;
  category_name?: string;
  role?: string;
  username?: string;
  email?: string;
};

const getActivityConfig = (url: string): { endpoint: string; page: string } | undefined => MASTER_ACTIVITY_CONFIG.find((config) => url.startsWith(config.endpoint));
const getActivityUserName = (): string => {
  const cookie = document.cookie.split("; ").find((value) => value.startsWith("quoteflow_username="));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "string";
};
const getActivityBody = (data: MasterActivityBody | string | undefined): MasterActivityBody => {
  if (!data) return {};

  return typeof data === "string" ? JSON.parse(data) : data;
};
const getActivityName = (data: MasterActivityBody): string => data.name ?? data.category_name ?? data.role ?? data.username ?? data.email ?? "";
const getActivityAction = (method: string): "create" | "edit" | "view" => {
  if (method === "POST") return "create";

  return method === "PUT" || method === "PATCH" ? "edit" : "view";
};

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(async (response) => {
  const url = response.config.url ?? "";
  const config = getActivityConfig(url);
  const method = response.config.method?.toUpperCase();

  if (config && !url.startsWith("/api/activity-log") && method && (method === "GET" || method === "POST" || method === "PUT" || method === "PATCH")) {
    const action = getActivityAction(method);
    const name = getActivityName(getActivityBody(response.config.data));
    const description = action === "view"
      ? `melihat page ${config.page}`
      : `melakukan ${action} data ${config.page} name: ${name}`;

    await apiClient.post("/api/activity-log", {
      user_name: getActivityUserName(),
      action,
      page: config.page,
      description,
    });
  }

  return response;
});

export default apiClient;

