import axios from "axios"

const service = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
  }
})

export default service;
