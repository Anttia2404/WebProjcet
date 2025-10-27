import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setRawToken] = useState(
    localStorage.getItem("authToken") || null
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        setRawToken(null);
      }
    } else {
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    setRawToken(response.data.token);
  };

  const logout = () => {
    setRawToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setRawToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
