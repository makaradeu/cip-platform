import axios from "axios";
import { CONFIG } from "../config";
import { get } from "node:http";

// Tokent store
export const TokentStore = {
    _token: "" as string,

    set(token: string) {
        this._token = token;
    },

    get() {
        return this._token;
    }
};

// Axios instance
const instance = axios.create({
    baseURL: CONFIG.baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Auto attach tokent to every request
instance.interceptors.request.use(
    (config) => {
        const token = TokentStore.get();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }
);

export default instance