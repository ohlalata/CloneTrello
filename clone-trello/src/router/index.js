import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./authRoutes";
import UserRoutes from "./userRoutes";
import PrivateRoute from "../components/privateRoute";

const Index = () => {
  return (
    <Routes>
      <Route>
        {AuthRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={route.component}
            key={idx}
            exact={true}
          />
        ))}
      </Route>

      <Route element={<PrivateRoute />}>
        {UserRoutes.map((route, idx) => {
          if (route?.index)
            return (
              <Route
                path={route.path}
                element={route.component}
                key={idx}
                index
              />
            );
          if (!route?.index)
            return (
              <Route path={route.path} element={route.component} key={idx}>
                (
                {route?.children &&
                  route.children.map((r) => {
                    return (
                      <Route path={r.path} element={r.component} key={idx} />
                    );
                  })}
                )
              </Route>
            );
        })}
      </Route>
    </Routes>
  );
};

export default Index;
