import axios, { AxiosError } from "axios";
import type Response from "../types/Response";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({
    baseURL: API_BASE_URL + "/api",
    withCredentials: false,
});

export const getCsrfCookie = () => Promise.resolve();

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const data = response.data as Response<any> | any;

        if (data && typeof data === "object" && "success" in data) {
            if (!data.success) {
                return Promise.reject(
                    new Error(data.issue || data.message || "Something went wrong"),
                );
            }
        }

        return response;
    },
    (error: AxiosError<Response<any>>) => {
        const status = error.response?.status;
        if (status === 401) {
            useAuthStore.getState().reset();
        }
        const payload = error.response?.data;
        const message =
            payload?.issue || payload?.message || error.message || "Request failed";
        return Promise.reject(new Error(message));
    },
);
