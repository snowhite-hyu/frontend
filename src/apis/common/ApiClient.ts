import axios from "axios"

const service = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
  }
})

export default service;
