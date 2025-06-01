import axios from "axios";

export const publicApi = axios.create({
  baseURL: "api/g", // misalnya public API prefix-mu adalah /g
  headers: {
    "Content-Type": "application/json",
  },
});
