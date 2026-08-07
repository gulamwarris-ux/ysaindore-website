import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const submitEnquiry = (data) => api.post("/enquiries", data).then((r) => r.data);
export const fetchBlog = () => api.get("/blog").then((r) => r.data);
export const fetchPost = (slug) => api.get(`/blog/${slug}`).then((r) => r.data);
