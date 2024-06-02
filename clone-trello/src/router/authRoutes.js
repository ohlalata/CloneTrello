import React from "react";
import LoginPages from "../pages/Login";
import RegisterPages from "../pages/Register";

const AuthRoutes = [
  { path: "/", component: <LoginPages /> },
  { path: "/register", component: <RegisterPages /> },
];

export default AuthRoutes;
