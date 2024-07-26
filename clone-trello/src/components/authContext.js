import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosLocalHost from "../utils/customAxios";
import userService from "../api/Services/user";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navigateHot, setNavigateHot] = useState();
  const [labelMiddle, setLabelMiddle] = useState([]);

  const loginContext = (Token) => {
    if (Token) {
      localStorage.setItem("checkAuth", "true");
      localStorage.setItem("token", Token);
      axiosLocalHost.setAuthToken(Token);
      fetchUserProfile();
      setIsAuthenticated(true);
      navigate("/home");
    } else {
      localStorage.setItem("checkAuth", "false");
      localStorage.removeItem("token");
      axiosLocalHost.setAuthToken(null);
      localStorage.removeItem("userProfile");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUserProfile();
      const userProfile = response.data;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  //

  useEffect(() => {
    const checkAuth = localStorage.getItem("checkAuth") === "true";
    setIsAuthenticated(checkAuth);
    const token = localStorage.getItem("token");
    if (checkAuth && token) {
      axiosLocalHost.setAuthToken(token);
      fetchUserProfile();
      navigate(navigateHot);
    } else {
      axiosLocalHost.setAuthToken(null);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setNavigateHot(window.location.href);
  });

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginContext, labelMiddle, setLabelMiddle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
