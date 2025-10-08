import { env } from "$env/dynamic/public";
import axios from "axios";

const api = axios.create();

api.interceptors.request.use(function (config) {
    config.baseURL = env.PUBLIC_BASE_URL;

    if (!config.url?.includes("/auth/local")) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default api;