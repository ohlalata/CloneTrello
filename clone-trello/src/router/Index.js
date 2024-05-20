import React from "react";
import { UserRoutes, AuthRoutes } from "./AllRoutes";
import { Route, Routes } from "react-router-dom";
import LoginPages from "../pages/Login/Index";
import HomePages from "../pages/Home/Index";
import SignupPages from "../pages/Signup/Index";
import NavBar from "../commons/navbar/Index";

const Index = () => {
  return (
    <Routes>
      <Route>
        {AuthRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={route.component}
            key={idx}
            exact={true} // in next time, use elemet euthen other "isAuthenticated:"
          />
        ))}
      </Route>

      {UserRoutes.map((route, idx) => (
        <Route path={route.path} element={route.component} key={idx}>
          {/* example */}
          <Route path="dashboard" element={<LoginPages />} />
          {/* example */}
          <Route path="listboard" element={<SignupPages />} />
          {/*example*/}
          <Route path="navbar" element={<NavBar />}></Route>
        </Route>
      ))}
    </Routes>
  );
};

export default Index;
