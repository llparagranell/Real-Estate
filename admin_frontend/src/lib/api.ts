import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`;

export const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Send httpOnly cookies with requests
});
