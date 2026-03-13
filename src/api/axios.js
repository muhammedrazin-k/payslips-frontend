import axios from "axios";

const API = axios.create({
  baseURL: "https://payslip-backend-u32z.onrender.com",
});

export default API;