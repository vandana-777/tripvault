import axios from "axios";

const API = axios.create({
    baseURL: "https://tripvault-2pmy.onrender.com/api/auth",
});

export const registerUser = (userData) => {
    return API.post("/register", userData);
};

export const loginUser = (userData) => {
    return API.post("/login", userData);
};

export const getUser = (token) => {
  return API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};