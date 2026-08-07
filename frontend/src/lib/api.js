import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

export const submitEnquiry = (data) => api.post("/enquiries", data).then((r) => r.data);
export const fetchBlog = () => api.get("/blog").then((r) => r.data);
export const fetchPost = (slug) => api.get(`/blog/${slug}`).then((r) => r.data);

export const exchangeSession = (session_id) => api.post("/auth/session", { session_id }).then((r) => r.data);
export const authMe = () => api.get("/auth/me").then((r) => r.data);
export const authLogout = () => api.post("/auth/logout").then((r) => r.data);

export const adminList = () => api.get("/admin/enquiries").then((r) => r.data);
export const adminUpdate = (id, data) => api.patch(`/admin/enquiries/${id}`, data).then((r) => r.data);
export const adminDelete = (id) => api.delete(`/admin/enquiries/${id}`).then((r) => r.data);
export const adminExport = () => api.get("/admin/enquiries/export", { responseType: "blob" }).then((r) => r.data);
