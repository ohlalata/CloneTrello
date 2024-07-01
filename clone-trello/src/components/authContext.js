import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosLocalHost from "../utils/customAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("checkAuth")
  );

  const loginContext = (Token) => {
    if (Token) {
      localStorage.setItem("checkAuth", true);
      setIsAuthenticated(true);
    } else {
      localStorage.setItem("checkAuth", false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = localStorage.getItem("checkAuth");
    setIsAuthenticated(checkAuth == "true");
    const token = localStorage.getItem("token");
    if (token) {
      axiosLocalHost.setAuthToken(token);
      navigate("/home");
    } else {
      axiosLocalHost.setAuthToken(null);
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
