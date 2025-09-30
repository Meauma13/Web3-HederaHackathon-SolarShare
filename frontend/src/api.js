import axios from "axios";

/* const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export async function initToken() {
    return API.post("/init-token");
}
export async function register(user) {
    return API.post("/register", user);
}
export async function topup(data) {
    return API.post("/topup", data);
}
export async function consume(data) {
    return API.post("/consume", data);
}
export async function getBalance(userId) {
    return API.get(`/balance/${userId}`);
}
export async function listUsers() {
    return API.get(`/users`);
}
export async function listUsage() {
    return API.get("/usage");
} */

export const api = axios.create({ baseURL: "/api" });
