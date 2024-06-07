import React from "react";
import LoginPages from "../pages/login";
import RegisterPages from "../pages/register";

const AuthRoutes = [
  { path: "/", component: <LoginPages /> },
  { path: "/register", component: <RegisterPages /> },
];

export default AuthRoutes;
